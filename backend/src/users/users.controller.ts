import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationDto } from './dtos/pagination.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SafeUser } from './types/user-safe.interface';
import { WinstonLogger } from 'src/common/logger/logger.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
    private logger: WinstonLogger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query() pagination: PaginationDto): Promise<SafeUser[]> {
    console.log(pagination);
    return this.usersService.findAllUsers(pagination);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: { user: { id: string } }): Promise<SafeUser> {
    return this.usersService.getMe(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/tasks')
  getTasks(@Req() req: { user: { id: string } }) {
    return this.usersService.getUserTasks(req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  getOneById(@Param('id') id: string): Promise<SafeUser> {
    return this.usersService.findUserById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only images are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: updateUserDto,
  ): Promise<SafeUser> {
    const currentUser = await this.usersService.findUserById(id);

    let imageData = { publicId: '', url: '' };

    if (file) {
      // If user has an existing avatar, delete it first
      if (currentUser.imagePublicId) {
        this.logger.log(
          `Deleting old avatar for user ${id}: ${currentUser.imagePublicId}`,
        );
        await this.cloudinaryService.deleteCloudinaryFile(
          currentUser.imagePublicId,
        );
      }

      // Upload the new file
      imageData = await this.cloudinaryService.uploadFile(file);
      if (!imageData.url || !imageData.publicId) {
        throw new Error('File upload failed');
      }
    }

    return this.usersService.updateUser(id, {
      ...updateUserDto,
      ...(file && {
        imagePublicId: imageData.publicId,
        avatarUrl: imageData.url,
      }),
    });
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{
    message: string;
  }> {
    return this.usersService.deleteUser(id);
  }
}
