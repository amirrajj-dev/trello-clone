import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Module({
  providers: [TasksService, RolesGuard],
  controllers: [TasksController],
  exports: [TasksService],
  imports: [forwardRef(() => ProjectsModule)],
})
export class TasksModule {}
