/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma';
import { CreatePromotionDtoRepository } from '../dto/create-promotion-repository.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';
import { Promotion } from '../entities/promotion.entity';

@Injectable()
export class PromotionsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async create(
    createPromotionDto: CreatePromotionDtoRepository,
  ): Promise<Promotion> {
    return await this.prisma.promotion.create({
      data: createPromotionDto,
    });
  }

  async findAll(): Promise<Promotion[]> {
    return await this.prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllWithInactive(): Promise<Promotion[]> {
    return await this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Promotion | null> {
    return await this.prisma.promotion.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion> {
    return await this.prisma.promotion.update({
      where: { id },
      data: updatePromotionDto,
    });
  }

  async softDelete(id: string): Promise<Promotion> {
    return await this.prisma.promotion.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async restore(id: string): Promise<Promotion> {
    return await this.prisma.promotion.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string): Promise<Promotion> {
    return await this.prisma.promotion.delete({
      where: { id },
    });
  }
}
