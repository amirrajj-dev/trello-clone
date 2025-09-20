import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(40)
  name: string;
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(200)
  description?: string;
}
