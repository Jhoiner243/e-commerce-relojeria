import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaRepository } from './repositories/categoria.repository';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriaRepository, PrismaService],
})
export class CategoriasModule {}
