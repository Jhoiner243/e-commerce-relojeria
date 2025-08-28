import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { CategoriaRepository } from './repositories/categoria.repository';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriaRepository],
})
export class CategoriasModule {}
