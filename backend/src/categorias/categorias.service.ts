import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CategoriaRepository } from './repositories/categoria.repository';

@Injectable()
export class CategoriasService {
  constructor(
    @Inject(CategoriaRepository)
    private readonly categoriaRepository: CategoriaRepository,
  ) {}
  create(createCategoriaDto: CreateCategoriaDto) {
    return createCategoriaDto;
  }

  findAll() {
    return `This action returns all categorias`;
  }

  findOne(id: string) {
    return this.categoriaRepository.findOne(id);
  }

  update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaRepository.update(id, updateCategoriaDto);
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
