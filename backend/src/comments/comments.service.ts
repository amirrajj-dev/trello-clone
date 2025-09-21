import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentWithUser } from './types/Comment-with-user.interface';
import { Response } from 'src/common/types/response.type';
import { CommentDeleteResponse } from './types/comment-delete-response.interface';
import { Comment } from './types/comment.interface';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private logger: WinstonLogger,
  ) {}
  private async assertProjectMember(userId: string, projectId: string) {
    const member = await this.prismaService.projectMember.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });
    if (!member)
      throw new ForbiddenException('You are not a member of this project');
    return member;
  }

  async addComment(
    taskId: string,
    userIdFromReq: string,
    comment: CreateCommentDto,
  ): Promise<Response<CommentWithUser>> {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    const projectMember = await this.assertProjectMember(
      userIdFromReq,
      task.projectId,
    );
    const newComment = await this.prismaService.comment.create({
      data: {
        content: comment.content,
        taskId,
        userId: userIdFromReq,
      },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });

    this.logger.log(`comment ${newComment.id} Created Succssfully`);
    return {
      data: newComment,
      message: 'Comment added successfully',
    };
  }
  async getCommentsForSingleTask(
    taskId: string,
    userIdFromReq: string,
  ): Promise<Response<Omit<CommentWithUser, 'taskId'>[]>> {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        comments: {
          select: {
            id: true,
            content: true,
            userId: true,
            user: {
              select: { name: true, avatarUrl: true },
            },
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        projectId: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    const projectMember = await this.assertProjectMember(
      userIdFromReq,
      task.projectId,
    );
    this.logger.log(`Comments For Task ${taskId} Fetched Successfully`);
    return {
      message: 'Comments fetched successfully',
      data: task.comments,
    };
  }
  async updateComment(
    commentId: string,
    userIdFromReq: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Response<Comment>> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment Not Found');
    }
    const commentTask = await this.prismaService.task.findUnique({
      where: {
        id: comment.taskId,
      },
    });
    if (!commentTask) {
      throw new NotFoundException('Comment Task Not Found');
    }
    const projectMember = await this.assertProjectMember(
      userIdFromReq,
      commentTask.projectId,
    );
    if (
      comment.userId !== userIdFromReq &&
      projectMember.role !== 'ADMIN' &&
      projectMember.role !== 'OWNER'
    ) {
      throw new ForbiddenException(
        'You are not allowed to update this comment',
      );
    }
    if (!updateCommentDto.content) {
      return {
        data: comment,
        message: 'No Updates Found',
      };
    }
    const updatedComment = await this.prismaService.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: updateCommentDto.content,
      },
    });
    this.logger.log(`Comment ${commentId} Updated Successfully`);
    return {
      data: updatedComment,
      message: 'Comment updated successfully',
    };
  }
  async deleteComment(
    commentId: string,
    userIdFromReq: string,
  ): Promise<Response<CommentDeleteResponse>> {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment Not Found');
    }
    const commentTask = await this.prismaService.task.findUnique({
      where: {
        id: comment.taskId,
      },
    });
    if (!commentTask) {
      throw new NotFoundException('Comment Task Not Found');
    }
    const projectMember = await this.assertProjectMember(
      userIdFromReq,
      commentTask.projectId,
    );
    if (
      comment.userId !== userIdFromReq &&
      projectMember.role !== 'ADMIN' &&
      projectMember.role !== 'OWNER'
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment',
      );
    }
    await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
    this.logger.log(`Comment ${commentId} Deleted Successfully`);
    return {
      message: 'Comment deleted successfully',
      data: {
        id: commentId,
        taskId: comment.taskId,
      },
    };
  }
}
