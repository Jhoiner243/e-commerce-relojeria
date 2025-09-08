import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsRepository } from './repository/promotions.repository';

@Injectable()
export class PromotionsService {
  constructor(
    @Inject(PromotionsRepository)
    private readonly promotionsRepository: PromotionsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    let imagenUrl = '';

    // Si hay una imagen, subirla a Cloudinary
    if (createPromotionDto.imagen) {
      try {
        imagenUrl = await this.cloudinaryService.uploadImage(
          createPromotionDto.imagen,
          'promotions',
        );
      } catch (error) {
        throw new Error(
          `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    const promotionData = {
      ...createPromotionDto,
      imagen: imagenUrl,
    };

    return this.promotionsRepository.create(promotionData);
  }

  findAll() {
    return this.promotionsRepository.findAll();
  }

  findAllWithInactive() {
    return this.promotionsRepository.findAllWithInactive();
  }

  findOne(id: string) {
    return this.promotionsRepository.findOne(id);
  }

  update(id: string, updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsRepository.update(id, updatePromotionDto);
  }

  softDelete(id: string) {
    return this.promotionsRepository.softDelete(id);
  }

  restore(id: string) {
    return this.promotionsRepository.restore(id);
  }

  remove(id: string) {
    return this.promotionsRepository.remove(id);
  }
}
