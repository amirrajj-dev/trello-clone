import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { Comment } from './types/comment.interface';
import { Response } from 'src/common/types/response.type';
import { CommentDeleteResponse } from './types/comment-delete-response.interface';

@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Put(':id/:commentId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') projectId: string,
    @Param('commentId') commentid: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: { user: { id: string } },
  ): Promise<Response<Comment>> {
    return this.commentsService.updateComment(
      commentid,
      req.user.id,
      updateCommentDto,
    );
  }
  @Delete(':id/:commentId')
  delete(
    @Param('id') projectId: string,
    @Param('commentId') commentId: string,
    @Req() req: { user: { id: string } },
  ): Promise<Response<CommentDeleteResponse>> {
    return this.commentsService.deleteComment(commentId, req.user.id);
  }
}
