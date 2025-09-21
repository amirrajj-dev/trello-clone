import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(120)
  content?: string;
}
