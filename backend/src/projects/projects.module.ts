import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersModule } from 'src/users/users.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  providers: [ProjectsService, RolesGuard, JwtAuthGuard],
  controllers: [ProjectsController],
  imports: [UsersModule, forwardRef(() => TasksModule)],
  exports: [ProjectsService],
})
export class ProjectsModule {}
