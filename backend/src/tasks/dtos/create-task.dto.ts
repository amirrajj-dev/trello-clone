import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { PRIORITY } from 'src/common/enums/priority.enum';
import { TASKSTATUS } from 'src/common/enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(60)
  title: string;
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(120)
  description?: string;
  @IsOptional()
  @IsEnum(PRIORITY)
  priority?: PRIORITY;
  @IsOptional()
  @IsEnum(TASKSTATUS)
  status?: TASKSTATUS;
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  dueDate?: Date;
  @IsString()
  @IsOptional()
  assigneeId?: string;
}
