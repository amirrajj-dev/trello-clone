import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Request } from 'express';
import { User } from 'src/users/types/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // no roles required
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const projectId = request.params.id;
    const project = await this.prismaService.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        ownerId: true,
      },
    });
    if (!project) throw new ForbiddenException('Project not found');
    const member = await this.prismaService.projectMember.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId: user.id,
        },
      },
      select: {
        role: true,
      },
    });
    if (!member) throw new ForbiddenException('Not a Project Member');
    // Owner Always Have Access 🕷️
    if (member.role === 'OWNER') {
      return true;
    }
    if (!requiredRoles.includes(member.role as Role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
