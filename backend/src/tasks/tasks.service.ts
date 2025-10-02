import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { PRIORITY } from 'src/common/enums/priority.enum';
import { Response } from 'src/common/types/response.type';
import { Task } from './types/task.interface';
import { TaskDeleteResponse } from './types/task-delete.interface';
import { TASKSTATUS } from 'src/common/enums/task-status.enum';
import { NotificationOptions } from 'src/common/enums/notification.enum';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectsService: ProjectsService,
    private readonly notificationsService: EventsService,
    private logger: WinstonLogger,
  ) {}
  async createTask(
    task: CreateTaskDto,
    projectId: string,
    userId: string,
  ): Promise<Response<Task>> {
    const { data: project } = await this.projectsService.getProject(
      projectId,
      userId,
    );
    if (task.assigneeId) {
      const member = await this.prismaService.projectMember.findUnique({
        where: { userId_projectId: { userId: task.assigneeId, projectId } },
      });
      if (!member)
        throw new BadRequestException('Assignee must be a project member');
    }

    const progressValue =
      task.status === TASKSTATUS.TODO
        ? 0
        : task.status === TASKSTATUS.IN_PROGRESS
          ? 50
          : 100;

    const newTask = await this.prismaService.task.create({
      data: {
        ...task,
        projectId,
        priority: task.priority ?? PRIORITY.MEDIUM,
        status: task.status ?? TASKSTATUS.TODO,
        progress: progressValue,
      },
    });

    this.logger.log(`Task ${newTask.id} Created Successfully`);
    if (newTask.assigneeId && newTask.assigneeId !== userId) {
      await this.notificationsService.sendNotification(
        newTask.assigneeId,
        NotificationOptions.TASK_ASSIGNED,
        `You have been assigned a new task: ${newTask.title}`,
        { taskId: newTask.id, projectId },
      );
    }

    if (project.ownerId && project.ownerId !== userId) {
      if (!task.assigneeId || task.assigneeId !== project.ownerId) {
        const user = await this.prismaService.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });

        await this.notificationsService.sendNotification(
          project.ownerId,
          NotificationOptions.TASK_ASSIGNED,
          `${user?.name} created a new task: ${newTask.title}`,
          { projectId, taskId: newTask.id },
        );
      }
    }

    return {
      message: 'Task created successfully',
      data: newTask,
    };
  }
  async getAllTasksForSingleProject(
    projectId: string,
    userId: string,
  ): Promise<Response<Task[]>> {
    await this.projectsService.getProject(projectId, userId);
    const tasks = await this.prismaService.task.findMany({
      where: {
        projectId,
      },
      select: {
        id: true,
        _count: {
          select: { comments: true },
        },
        assignee: {
          select: {
            name: true,
            avatarUrl: true,
            email: true,
          },
        },
        assigneeId: true,
        createdAt: true,
        description: true,
        dueDate: true,
        Notification: true,
        priority: true,
        progress: true,
        project: {
          select: {
            name: true,
            members: {
              select: {
                role: true,
                userId: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        projectId: true,
        status: true,
        title: true,
        updatedAt: true,
      },
    });
    this.logger.log('Tasks fetched successfully');
    return {
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  }
  async updateTask(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Response<Task>> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }

    const projectMember = await this.prismaService.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId: task.projectId } },
    });
    if (!projectMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    if (updateTaskDto.assigneeId) {
      const member = await this.prismaService.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: updateTaskDto.assigneeId,
            projectId: task.projectId,
          },
        },
      });
      if (!member) {
        throw new BadRequestException('Assignee must be a project member');
      }
    }

    const updates: {
      title?: string;
      description?: string;
      status?: TASKSTATUS;
      priority?: PRIORITY;
      assigneeId?: string;
      dueDate?: Date;
      progress?: number;
    } = Object.fromEntries(
      Object.entries(updateTaskDto).filter(([_, value]) => value !== undefined),
    );

    if (updates.status && updates.progress === undefined) {
      if (updates.status === TASKSTATUS.DONE) {
        updates.progress = 100;
      } else if (updates.status === TASKSTATUS.IN_PROGRESS) {
        updates.progress = 50;
      } else if (updates.status === TASKSTATUS.TODO) {
        updates.progress = 0;
      }
    }

    // Auto-update status based on progress changes
    if (updates.progress !== undefined && !updates.status) {
      if (updates.progress === 100) {
        updates.status = TASKSTATUS.DONE;
      } else if (updates.progress === 0) {
        updates.status = TASKSTATUS.TODO;
      } else if (updates.progress > 0 && updates.progress < 100) {
        updates.status = TASKSTATUS.IN_PROGRESS;
      }
    }

    if (Object.keys(updates).length === 0) {
      return { message: 'No Fields To Update', data: task };
    }

    const updatedTask = await this.prismaService.task.update({
      where: { id: task.id },
      data: updates,
    });

    this.logger.log(`Task ${updatedTask.id} Updated Successfully`);

    // Notifications
    const notifications: Array<{ userId: string; payload: any }> = [];

    if (
      updates.assigneeId &&
      task.assigneeId &&
      task.assigneeId !== updates.assigneeId
    ) {
      notifications.push({
        userId: task.assigneeId,
        payload: {
          type: NotificationOptions.TASK_UNASSIGNED,
          taskId: updatedTask.id,
          projectId: task.projectId,
          message: `You have been unassigned from task "${updatedTask.title}".`,
        },
      });
    }

    if (updates.assigneeId) {
      notifications.push({
        userId: updates.assigneeId,
        payload: {
          type: NotificationOptions.TASK_ASSIGNED,
          taskId: updatedTask.id,
          projectId: task.projectId,
          message: `Task "${updatedTask.title}" has been assigned to you.`,
        },
      });
    }

    if (updates.status && updatedTask.assigneeId) {
      notifications.push({
        userId: updatedTask.assigneeId,
        payload: {
          type: NotificationOptions.TASK_STATUS_CHANGED,
          taskId: updatedTask.id,
          projectId: task.projectId,
          message: `Task "${updatedTask.title}" status changed to ${updates.status}.`,
        },
      });
    }

    if (updatedTask.assigneeId && updates.progress !== undefined) {
      const { data: project } = await this.projectsService.getProject(
        updatedTask.projectId,
        userId,
      );
      if (project) {
        notifications.push({
          userId: project.ownerId,
          payload: {
            type: NotificationOptions.TASK_PROGRESS_UPDATED,
            taskId: updatedTask.id,
            projectId: task.projectId,
            message: `Task "${updatedTask.title}" progress updated to ${updates.progress}%.`,
          },
        });
      }
    }

    // Send all notifications
    for (const { userId, payload } of notifications) {
      await this.notificationsService.sendNotification(
        userId,
        payload.type,
        payload.message,
        {
          taskId: payload.taskId,
          projectId: payload.projectId,
        },
      );
    }

    return { message: 'Task updated successfully', data: updatedTask };
  }
  async deleteTask(
    taskId: string,
    userId: string,
  ): Promise<Response<TaskDeleteResponse>> {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    const projectMember = await this.prismaService.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId: task.projectId } },
    });
    if (!projectMember) {
      throw new ForbiddenException('You are not a member of this project');
    }
    if (task.assigneeId) {
      await this.notificationsService.sendNotification(
        task.assigneeId,
        NotificationOptions.TASK_DELETED,
        `Your task "${task.title}" was deleted.`,
        { taskId: task.id, projectId: task.projectId },
      );
    }
    // Notify project owner
    const project = await this.prismaService.project.findUnique({
      where: { id: task.projectId },
      select: { ownerId: true },
    });

    if (project?.ownerId && project.ownerId !== task.assigneeId) {
      await this.notificationsService.sendNotification(
        project.ownerId,
        NotificationOptions.TASK_DELETED,
        `Task "${task.title}" was deleted from your project.`,
        { taskId: task.id, projectId: task.projectId },
      );
    }
    await this.prismaService.task.delete({
      where: {
        id: taskId,
      },
    });
    this.logger.log(`Task ${taskId} Deleted Successfully`);

    return {
      message: 'Task deleted successfully',
      data: { id: task.id, projectId: task.projectId },
    };
  }
}
