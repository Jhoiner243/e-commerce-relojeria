import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  create(
    @Body() createPromotionDto: CreatePromotionDto,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    const promotionData: CreatePromotionDto = {
      ...createPromotionDto,
      imagen,
    };

    return this.promotionsService.create(promotionData);
  }

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get('all')
  findAllWithInactive() {
    return this.promotionsService.findAllWithInactive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Patch(':id/soft-delete')
  softDelete(@Param('id') id: string) {
    return this.promotionsService.softDelete(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.promotionsService.restore(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(id);
  }
}
