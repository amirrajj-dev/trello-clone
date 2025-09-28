import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { UsersService } from 'src/users/users.service';
import { AddMemberToProjectDto } from './dtos/add-member-to-project.dto';
import { Role } from 'src/common/enums/role.enum';
import { Project } from './types/project.interface';
import { Response } from 'src/common/types/response.type';
import { ProjectWithCounts } from './types/project-with-count.interface';
import { ProjectWithDetails } from './types/project-with-details.interface';
import { ProjectMemberResponse } from './types/project-member.interface';
import { BasicResponse } from 'src/common/types/basic-response-type';
import { NotificationOptions } from 'src/common/enums/notification.enum';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly notificationsService: EventsService,
    private logger: WinstonLogger,
  ) {}

  async getProjects(userId: string): Promise<Response<ProjectWithCounts[]>> {
    const projects = await this.prismaService.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { userId },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
        members: {
          select: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
                id: true,
              },
            },
            role: true,
          },
        },
        tasks: {
          select: {
            progress: true,
          },
        },
        owner: {
          select: {
            name: true,
          },
        },
      },
    });
    this.logger.log('Projects Fetched Succesfully');
    return {
      data: projects,
      message: 'Projects Fetched Succesfully',
    };
  }

  async getProject(
    projectId: string,
    userId: string,
  ): Promise<Response<ProjectWithDetails>> {
    const project = await this.prismaService.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        ownerId: true,
        owner: {
          select: {
            name: true,
          },
        },
        members: {
          select: {
            userId: true,
            user: {
              select: {
                name: true,
                avatarUrl: true,
                id: true,
                email: true,
              },
            },
            role: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            assigneeId: true,
          },
        },
        _count: {
          select: {
            members: true,
            tasks: true,
          },
        },
      },
    });
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }
    const projectMember = await this.prismaService.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId: projectId } },
    });
    if (!projectMember) {
      throw new ForbiddenException('You are not a member of this project');
    }

    this.logger.log('Project Fetched Succesfully');
    return {
      data: project,
      message: 'Projects Fetched Succesfully',
    };
  }

  async createProject(
    project: CreateProjectDto,
    ownerId: string,
  ): Promise<Response<Project>> {
    try {
      const isProjectExist = await this.prismaService.project.findFirst({
        where: {
          name: {
            equals: project.name,
            mode: 'insensitive',
          },
        },
      });
      if (isProjectExist) {
        throw new NotAcceptableException(
          'Project With This Exact Name Already exists',
        );
      }
      const newProject = await this.prismaService.project.create({
        data: {
          name: project.name.toLowerCase(),
          description: project.description || '',
          ownerId,
          members: {
            create: {
              userId: ownerId,
              role: 'OWNER',
            },
          },
        },
      });
      this.logger.log('Project Created Succesfully');
      return {
        data: newProject,
        message: 'Project Created Successfully',
      };
    } catch (error) {
      this.logger.log('Error Creating Project');
      throw new InternalServerErrorException(
        `Error Creating Project => ${error instanceof Error ? error.message : error}`,
      );
    }
  }
  async updateProject(
    id: string,
    project: UpdateProjectDto,
    userIdFromReq: string,
  ): Promise<Response<ProjectWithDetails>> {
    try {
      const { data: projectToUpdate } = await this.getProject(
        id,
        userIdFromReq,
      );
      const updates: { name?: string; description?: string } = {};
      if (project.name) updates.name = project.name;
      if (project.description) updates.description = project.description;
      if (Object.keys(updates).length === 0) {
        return {
          data: projectToUpdate,
          message: 'No Updates',
        };
      }
      await this.prismaService.project.update({
        where: {
          id: projectToUpdate.id,
        },
        data: {
          name: updates.name || projectToUpdate.name,
          description: updates.description || projectToUpdate.description,
        },
      });
      this.logger.log('Project Updated Succesfully');
      const projectMembers = await this.prismaService.projectMember.findMany({
        where: { projectId: projectToUpdate.id },
        select: { userId: true },
      });
      for (const member of projectMembers) {
        await this.notificationsService.sendNotification(
          member.userId,
          NotificationOptions.PROJECT_UPDATED,
          `The project "${projectToUpdate.name}" has been updated`,
          { projectId: projectToUpdate.id },
        );
      }
      const { data } = await this.getProject(projectToUpdate.id, userIdFromReq);
      return {
        data,
        message: 'Project Updated Succesfully',
      };
    } catch (error) {
      this.logger.log('Error Updating Project');
      throw new InternalServerErrorException(
        `Error Updating Project => ${error instanceof Error ? error.message : error}`,
      );
    }
  }
  // admin privilage
  async addMemberToProject(
    projectId: string,
    data: AddMemberToProjectDto,
    userIdFromReq: string,
  ): Promise<Response<ProjectMemberResponse>> {
    const { data: project } = await this.getProject(projectId, userIdFromReq);
    const { userId, role } = data;
    const user = await this.usersService.findUserById(userId);
    const existing = await this.prismaService.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (existing) {
      throw new NotAcceptableException('User already in project');
    }

    const projectMember = await this.prismaService.projectMember.create({
      data: {
        projectId: project.id,
        userId: user.id,
        role,
      },
    });
    this.logger.log(`${user.name} added to the project ${project.name}`);
    await this.notificationsService.sendNotification(
      user.id,
      NotificationOptions.PROJECT_MEMBER_ADDED,
      `You were added to the project "${project.name}"`,
      { projectId: project.id },
    );

    return {
      data: {
        id: projectMember.id,
        project: {
          id: project.id,
          name: project.name,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || '',
        },
        role,
      },
      message: `${user.name} added to the project ${project.name} Successfully`,
    };
  }
  async removeMemberFromProject(
    projectId: string,
    userId: string,
    userIdFromReq: string,
  ): Promise<{ projectId: string; userId: string; message: string }> {
    const { data: project } = await this.getProject(projectId, userIdFromReq);
    await this.usersService.findUserById(userId);
    if (project.ownerId === userId) {
      throw new ForbiddenException(
        'The User Your Trying To Delete is the Owner Of The Project',
      );
    }
    const userTasks = await this.prismaService.task.findMany({
      where: {
        projectId,
        assigneeId: userId,
      },
    });
    if (userTasks.length > 0) {
      throw new ForbiddenException('User Has Tasks');
    }
    await this.prismaService.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });
    await this.notificationsService.sendNotification(
      userId,
      NotificationOptions.PROJECT_MEMBER_REMOVED,
      `You were removed from the project "${project.name}"`,
      { projectId },
    );

    this.logger.log(`User ${userId} removed from project ${projectId}`);
    return {
      projectId,
      userId,
      message: `User ${userId} removed from project ${projectId}`,
    };
  }
  async changeMemberRole(
    projectId: string,
    userId: string,
    role: Role,
    userIdFromReq: string,
  ): Promise<BasicResponse> {
    const { data: project } = await this.getProject(projectId, userIdFromReq);
    await this.usersService.findUserById(userId);
    if (role === Role.OWNER) {
      throw new NotAcceptableException('Cannot change role to OWNER');
    } else {
      await this.prismaService.projectMember.update({
        where: {
          userId_projectId: {
            projectId,
            userId,
          },
        },
        data: {
          role,
        },
      });
    }
    await this.notificationsService.sendNotification(
      userId,
      NotificationOptions.ROLE_CHANGED,
      `Your role in project "${project.name}" has been changed to ${role}`,
      { projectId },
    );

    this.logger.log(
      `user ${userId} role for the project ${projectId} updated to ${role}`,
    );
    return {
      message: `user ${userId} role for the project ${projectId} updated to ${role}`,
    };
  }
  async transferOwnership(
    projectId: string,
    newOwnerId: string,
    userIdFromReq: string,
  ): Promise<Response<ProjectWithDetails>> {
    const { data: project } = await this.getProject(projectId, userIdFromReq);

    if (!project.ownerId)
      throw new NotAcceptableException('Owner Id is Required');

    if (project.ownerId === newOwnerId)
      throw new NotAcceptableException('User is already the owner');
    await this.usersService.findUserById(newOwnerId);
    if (project.members.find((m) => m.userId === newOwnerId) === undefined) {
      throw new NotAcceptableException(
        'New owner must be a member of the project',
      );
    }
    await this.prismaService.$transaction([
      // Demote current owner to ADMIN
      this.prismaService.projectMember.update({
        where: { userId_projectId: { userId: project.ownerId, projectId } },
        data: { role: 'ADMIN' },
      }),
      // Promote new owner
      this.prismaService.projectMember.update({
        where: { userId_projectId: { userId: newOwnerId, projectId } },
        data: { role: 'OWNER' },
      }),
      // Update project.ownerId
      this.prismaService.project.update({
        where: { id: projectId },
        data: { ownerId: newOwnerId },
      }),
    ]);

    const { data: updatedProject } = await this.getProject(
      projectId,
      userIdFromReq,
    );

    this.logger.log(
      `Ownership transferred to user ${newOwnerId} from ${project.ownerId}`,
    );
    // Notify the new owner
    await this.notificationsService.sendNotification(
      newOwnerId,
      NotificationOptions.OWNERSHIP_TRANSFERRED,
      `You are now the owner of the project "${project.name}"`,
      { projectId },
    );

    // notify the old owner
    await this.notificationsService.sendNotification(
      project.ownerId,
      NotificationOptions.OWNERSHIP_TRANSFERRED,
      `You are no longer the owner of the project "${project.name}"`,
      { projectId },
    );

    return {
      message: `Ownership transferred to user ${newOwnerId}`,
      data: updatedProject,
    };
  }
  async deleteProject(
    projectId: string,
    userIdFromReq: string,
  ): Promise<BasicResponse> {
    const { data: project } = await this.getProject(projectId, userIdFromReq);

    if (project.ownerId !== userIdFromReq) {
      throw new ForbiddenException(`Your Not Allowed For This Operation`);
    }
    const projectMembers = await this.prismaService.projectMember.findMany({
      where: { projectId },
      select: { userId: true },
    });

    for (const member of projectMembers) {
      await this.notificationsService.sendNotification(
        member.userId,
        NotificationOptions.PROJECT_DELETED,
        `The project "${project.name}" has been deleted`,
        { projectId },
      );
    }
    await this.prismaService.$transaction([
      this.prismaService.task.deleteMany({ where: { projectId } }),
      this.prismaService.projectMember.deleteMany({ where: { projectId } }),
      this.prismaService.project.delete({ where: { id: projectId } }),
    ]);

    this.logger.log(`Project ${projectId} deleted by user ${userIdFromReq}`);
    return { message: `Project ${projectId} deleted successfully` };
  }
}
