import { Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

export class CategoriaRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}
  findAll() {
    return this.prisma.categoria.findMany();
  }

  findOne(id: string) {
    return this.prisma.categoria.findUnique({
      where: {
        id,
      },
    });
  }

  create(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: createCategoriaDto,
    });
  }

  update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    return this.prisma.categoria.update({
      where: {
        id,
      },
      data: updateCategoriaDto,
    });
  }
}
