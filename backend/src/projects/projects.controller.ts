import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { AddMemberToProjectDto } from './dtos/add-member-to-project.dto';
import { ChangeMemberRoleDto } from './dtos/change-member-role.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'src/common/types/response.type';
import { ProjectWithCounts } from './types/project-with-count.interface';
import { ProjectWithDetails } from './types/project-with-details.interface';
import { Project } from '@prisma/client';
import { ProjectMemberResponse } from './types/project-member.interface';
import { BasicResponse } from 'src/common/types/basic-response-type';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<Response<ProjectWithCounts[]>> {
    return this.projectsService.getProjects();
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): Promise<Response<ProjectWithDetails>> {
    return this.projectsService.getProject(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProject(
    @Body() project: CreateProjectDto,
    @Req() req: { user: { id: string } },
  ): Promise<Response<Project>> {
    const ownerId = req.user.id;
    if (!ownerId) throw new BadRequestException('User ID not found in request');
    return this.projectsService.createProject(project, ownerId);
  }
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
  ): Promise<Response<ProjectWithDetails>> {
    return this.projectsService.updateProject(id, project);
  }
  @Post(':id/members')
  @Roles(Role.ADMIN)
  addMemberToProject(
    @Param('id') id: string,
    @Body() addMemberToProject: AddMemberToProjectDto,
  ): Promise<Response<ProjectMemberResponse>> {
    return this.projectsService.addMemberToProject(id, addMemberToProject);
  }
  @Delete(':id/members/:memberId')
  @Roles(Role.ADMIN)
  removeMemberFromProject(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ): Promise<{
    projectId: string;
    userId: string;
    message: string;
  }> {
    return this.projectsService.removeMemberFromProject(id, memberId);
  }
  @Put(':id/members/:memberId')
  @Roles(Role.ADMIN)
  changeMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string, // userId
    @Body() memberRole: ChangeMemberRoleDto,
  ): Promise<BasicResponse> {
    return this.projectsService.changeMemberRole(id, memberId, memberRole.role);
  }
  @Put(':id/transfer-ownership/:newOwnerId')
  @Roles(Role.OWNER)
  transferOwnership(
    @Param('id') projectId: string,
    @Param('newOwnerId') newOwnerId: string,
  ): Promise<Response<ProjectWithDetails>> {
    return this.projectsService.transferOwnership(projectId, newOwnerId);
  }
}
