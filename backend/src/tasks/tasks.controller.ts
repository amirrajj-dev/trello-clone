import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  // the first :id is the projectId
  @Put(':id/:taskId')
  @Roles(Role.ADMIN, Role.MEMBER, Role.OWNER)
  update(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.tasksService.updateTask(taskId, updateTaskDto, req.user.id);
  }

  @Delete(':id/:taskId')
  @Roles(Role.ADMIN, Role.MEMBER, Role.OWNER)
  delete(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Req() req: { user: { id: string } },
  ) {
    return this.tasksService.deleteTask(taskId, req.user.id);
  }
}
