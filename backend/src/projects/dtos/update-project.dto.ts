import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(40)
  name?: string;
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(200)
  description?: string;
}
