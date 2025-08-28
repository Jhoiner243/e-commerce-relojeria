import { Module } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, CloudinaryService],
})
export class ProductsModule {}
