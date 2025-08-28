import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as multer from 'multer';

@Injectable()
export class MulterCloudinaryMiddleware implements NestMiddleware {
  private upload: multer.Multer;

  constructor() {
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        // Verificar tipos de archivo permitidos
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'), false);
        }
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.upload.single('imagen')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File too large. Maximum size is 5MB',
          });
        }
        return res.status(400).json({
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }
      next();
    });
  }
}
