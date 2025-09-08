import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDtoRepository } from './create-promotion-repository.dto';

export class UpdatePromotionDto extends PartialType(
  CreatePromotionDtoRepository,
) {}
