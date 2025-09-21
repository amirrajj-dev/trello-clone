import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  providers: [TasksService, RolesGuard],
  controllers: [TasksController],
  exports: [TasksService],
  imports: [forwardRef(() => ProjectsModule), CommentsModule],
})
export class TasksModule {}
