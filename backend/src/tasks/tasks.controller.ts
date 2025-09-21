import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards,
  Req,
  Post,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CreateCommentDto } from 'src/comments/dtos/create-comment.dto';
import { CommentsService } from 'src/comments/comments.service';
import { CommentWithUser } from 'src/comments/types/Comment-with-user.interface';
import { Response } from 'src/common/types/response.type';
import { TaskDeleteResponse } from './types/task-delete.interface';
import { Task } from './types/task.interface';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private commentsService: CommentsService,
  ) {}
  // the first :id is the projectId
  @Put(':id/:taskId')
  @Roles(Role.ADMIN, Role.MEMBER, Role.OWNER)
  update(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: { user: { id: string } },
  ): Promise<Response<Task>> {
    return this.tasksService.updateTask(taskId, updateTaskDto, req.user.id);
  }

  @Delete(':id/:taskId')
  @Roles(Role.ADMIN, Role.MEMBER, Role.OWNER)
  delete(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Req() req: { user: { id: string } },
  ): Promise<Response<TaskDeleteResponse>> {
    return this.tasksService.deleteTask(taskId, req.user.id);
  }
  // comment related endpoints
  @Post(':id/:taskId/comments')
  @Roles(Role.ADMIN, Role.OWNER, Role.MEMBER)
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: { user: { id: string } },
  ): Promise<Response<CommentWithUser>> {
    return this.commentsService.addComment(
      taskId,
      req.user.id,
      createCommentDto,
    );
  }
  @Get(':id/:taskId/comments')
  @HttpCode(HttpStatus.OK)
  getComments(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Req() req: { user: { id: string } },
  ): Promise<Response<Omit<CommentWithUser, 'taskId'>[]>> {
    return this.commentsService.getCommentsForSingleTask(taskId, req.user.id);
  }
}
