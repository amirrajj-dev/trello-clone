import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';
import { Transform } from 'class-transformer';

export class ChangeMemberRoleDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  @Transform(({ value }: { value: Role }) => (value ? value : 'MEMBER'))
  role: Role;
}
