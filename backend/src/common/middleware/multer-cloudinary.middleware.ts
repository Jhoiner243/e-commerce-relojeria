/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MulterCloudinaryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Solo validar si hay un archivo en la request
    if (req.file) {
      const file = req.file as any;

      // Validar tipo de archivo
      if (!file.mimetype?.startsWith('image/')) {
        return res.status(400).json({
          message: 'Only image files are allowed',
        });
      }

      // Validar tamaño (5MB)
      if (file.size && file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          message: 'File too large. Maximum size is 5MB',
        });
      }
    }

    next();
  }
}
