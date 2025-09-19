import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class updateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  name?: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
  @IsString()
  @IsOptional()
  avatarUrl?: string;
  @IsString()
  @IsOptional()
  imagePublicId?: string;
}
