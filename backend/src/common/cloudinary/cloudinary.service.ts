import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { WinstonLogger } from '../logger/logger.service';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly configService: ConfigService,
    private logger: WinstonLogger,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{
    url: string;
    publicId: string;
  }> {
    this.logger.log(
      `Starting file upload: ${file.originalname}, size: ${file.size} bytes`,
    );

    if (
      !file.mimetype.startsWith('image/') &&
      !file.mimetype.startsWith('video/')
    ) {
      this.logger.warn(`Invalid file type attempted: ${file.mimetype}`);
      throw new NotAcceptableException(
        'Invalid file type. Only images and videos are allowed.',
      );
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    // Sanitize file name
    const safeFileName = file.originalname
      .split('.')[0]
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    try {
      this.logger.log(`Uploading file to Cloudinary: ${safeFileName}`);
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        if (file.buffer) {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'auto',
                folder: `trello-clone/${year}/${month}`,
                public_id: `${Date.now()}_${safeFileName}`,
              },
              (err, result) => {
                if (err) reject(err);
                resolve(result as UploadApiResponse);
              },
            )
            .end(file.buffer);
        } else {
          cloudinary.uploader.upload(
            file.path,
            {
              resource_type: 'auto',
            },
            (err, result) => {
              if (err) reject(err);
              resolve(result as UploadApiResponse);
            },
          );
        }
      });
      if (!result.secure_url || !result.public_id) {
        this.logger.error('Cloudinary upload returned incomplete data');
        throw new InternalServerErrorException(
          'Cloudinary upload did not return URL or public ID',
        );
      }
      this.logger.log(
        `File uploaded successfully: ${result.public_id}, URL: ${result.secure_url}`,
      );
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      const infos =
        error instanceof Error
          ? { message: error.message, stack: error.stack }
          : {};
      if (Object.keys(infos).length === 0) {
        this.logger.error(`Cloudinary upload failed`);
      } else {
        this.logger.error(
          `Cloudinary upload failed: ${infos.message}`,
          infos.stack,
        );
      }
      throw new InternalServerErrorException('File upload failed');
    }
  }
  async deleteCloudinaryFile(publicId: string) {
    this.logger.log(`Attempting to delete file: ${publicId}`);
    if (typeof publicId !== 'string' || publicId.trim().length === 0) {
      this.logger.warn('Invalid public ID provided for deletion');

      throw new BadRequestException('Invalid public ID format');
    }
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: 'image',
      });
      this.logger.log(
        `Deleted file from Cloudinary: ${publicId}, result: ${JSON.stringify(result)}`,
      );
    } catch (error) {
      this.logger.error('Failed to delete from Cloudinary');
      console.error('Failed to delete from Cloudinary:', error);
    }
  }
}
