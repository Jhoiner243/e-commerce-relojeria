/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { envs } from '../config/config';

function bufferToStream(buffer: Buffer): Readable {
  return Readable.from(buffer);
}

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: envs.cloudinaryCloudName,
      api_key: envs.cloudinaryApiKey,
      api_secret: envs.cloudinaryApiSecret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    try {
      if (!file || !file.buffer) {
        throw new Error('File buffer is missing');
      }

      const stream = bufferToStream(file.buffer as Buffer);

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [
              { width: 800, height: 800, crop: 'limit' },
              { quality: 'auto:good' },
            ],
          },
          (error, result: UploadApiResponse) => {
            if (error) {
              reject(new Error(error.message));
            } else if (result) {
              resolve(result.secure_url);
            } else {
              reject(new Error('Unknown error uploading image'));
            }
          },
        );

        stream.pipe(uploadStream);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error uploading image to Cloudinary: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error deleting image from Cloudinary: ${error.message}`,
        );
      }
      throw error;
    }
  }

  getImageUrl(publicId: string): string {
    try {
      return cloudinary.url(publicId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error generating Cloudinary URL: ${error.message}`);
      }
      return 'Error';
    }
  }
}
