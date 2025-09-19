import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { WinstonLogger } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from './dtos/pagination.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { User } from './types/user.interface';
import { SafeUser } from './types/user-safe.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private logger: WinstonLogger,
  ) {}

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<Omit<User, 'password' | 'updatedAt'>> {
    this.logger.log('Creating new user in DB');
    return this.prismaService.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  async findAllUsers(pagination: PaginationDto = {}): Promise<SafeUser[]> {
    const limit = pagination.limit || 10;
    const page = pagination.page || 1;

    const take = limit;
    const skip = (page - 1) * take;

    this.logger.log(
      `Fetching users from database: page=${page}, limit=${limit}`,
    );

    const users = await this.prismaService.user.findMany({
      take,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        avatarUrl: true,
        name: true,
        email: true,
        projects: {
          select: {
            project: {
              select: {
                name: true,
              },
            },
            role: true,
          },
        },
      },
    });

    const processedUsers = users.map((user) => ({
      ...user,
      avatarUrl: user.avatarUrl ?? undefined,
    }));

    return processedUsers;
  }

  async findUserById(id: string): Promise<SafeUser> {
    this.logger.log(`Fetching user with id: ${id} from database`);

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        avatarUrl: true,
        name: true,
        email: true,
        projects: {
          select: {
            project: {
              select: {
                name: true,
              },
            },
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }
  async findUserByEmailOrNull(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  async updateUser(
    id: string,
    updateUserDto: updateUserDto,
  ): Promise<SafeUser> {
    // Check if user exists first
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`Update attempted on non-existent user: ${id}`);
      throw new NotFoundException('User Not Found');
    }

    const updates: Partial<
      Pick<User, 'name' | 'email' | 'imagePublicId' | 'avatarUrl'>
    > = {};

    if (updateUserDto.avatarUrl && updateUserDto.imagePublicId) {
      updates.avatarUrl = updateUserDto.avatarUrl;
      updates.imagePublicId = updateUserDto.imagePublicId;
      this.logger.log(`Updating avatar for user: ${id}`);
    }

    if (updateUserDto.email !== undefined) {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: updateUserDto.email,
        },
      });
      if (user) {
        throw new NotAcceptableException('Email Already Exists');
      }
      updates.email = updateUserDto.email;
    }

    if (updateUserDto.name !== undefined) {
      updates.name = updateUserDto.name;
    }

    if (Object.keys(updates).length === 0) {
      this.logger.log(`No updates provided for user: ${id}`);
      return this.findUserById(id);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        avatarUrl: true,
        name: true,
        email: true,
        imagePublicId: true,
        projects: {
          select: {
            project: {
              select: {
                name: true,
              },
            },
            role: true,
          },
        },
      },
    });

    this.logger.log(`User ${id} updated successfully`);
    return updatedUser;
  }
  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`Delete attempted on non-existent user: ${id}`);
      throw new NotFoundException('User Not Found');
    }
    this.logger.log(`Deleting user: ${id}`);
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    this.logger.log(`User ${id} deleted successfully`);
    return { message: `User ${id} deleted successfully` };
  }
  async getMe(userId: string): Promise<SafeUser> {
    return this.findUserById(userId);
  }
}
