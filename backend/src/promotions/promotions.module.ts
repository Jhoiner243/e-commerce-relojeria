import { Module } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';
import { PromotionsRepository } from './repository/promotions.repository';

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, PromotionsRepository, CloudinaryService],
  exports: [PromotionsService],
})
export class PromotionsModule {}
