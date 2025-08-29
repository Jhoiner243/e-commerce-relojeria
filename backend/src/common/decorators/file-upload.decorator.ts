import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function FileUpload(
  fieldName: string = 'file',
  options?: MulterOptions,
) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, options)));
}

export function FilesUpload(
  fieldName: string = 'files',
  maxCount?: number,
  options?: MulterOptions,
) {
  const interceptorOptions = { ...options };
  if (typeof maxCount === 'number') {
    interceptorOptions.limits = {
      ...(interceptorOptions.limits || {}),
      files: maxCount,
    };
  }
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, interceptorOptions)),
  );
}
