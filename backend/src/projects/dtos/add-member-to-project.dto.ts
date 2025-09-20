import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Transform } from 'class-transformer';

export class AddMemberToProjectDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsOptional()
  @IsEnum(Role)
  @Transform(({ value }: { value: Role }) => (value ? value : 'MEMBER'))
  role?: Role;
}
