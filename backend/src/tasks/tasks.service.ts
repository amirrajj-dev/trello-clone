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

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectsService: ProjectsService,
    private logger: WinstonLogger,
  ) {}
  async createTask(
    task: CreateTaskDto,
    projectId: string,
    userId: string,
  ): Promise<Response<Task>> {
    await this.projectsService.getProject(projectId, userId);
    if (task.assigneeId) {
      const member = await this.prismaService.projectMember.findUnique({
        where: { userId_projectId: { userId: task.assigneeId, projectId } },
      });
      if (!member)
        throw new BadRequestException('Assignee must be a project member');
    }

    const newTask = await this.prismaService.task.create({
      data: {
        ...task,
        projectId,
        priority: task.priority ?? PRIORITY.MEDIUM,
        status: task.status ?? TASKSTATUS.TODO,
      },
    });
    this.logger.log(`Task ${newTask.id} Created Successfully`);
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

    if (updateTaskDto.assigneeId) {
      const member = await this.prismaService.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: updateTaskDto.assigneeId,
            projectId: task.projectId,
          },
        },
      });
      if (!member)
        throw new BadRequestException('Assignee must be a project member');
    }

    const updates: {
      title?: string;
      description?: string;
      status?: TASKSTATUS;
      priority?: PRIORITY;
      assigneeId?: string;
      dueDate?: Date;
    } = Object.fromEntries(
      Object.entries(updateTaskDto).filter(([_, value]) => value !== undefined),
    );
    if (Object.keys(updates).length === 0) {
      return {
        message: 'No Fields To Update',
        data: task,
      };
    }
    const updatedTask = await this.prismaService.task.update({
      where: {
        id: task.id,
      },
      data: updates,
    });
    this.logger.log(`Task ${updatedTask.id} Updated Successfully`);
    return {
      message: 'Task updated successfully',
      data: updatedTask,
    };
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
