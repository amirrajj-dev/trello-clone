import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  taskId?: string;

  @IsString()
  @IsOptional()
  commentId?: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsBoolean()
  read: boolean;
}
