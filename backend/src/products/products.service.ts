import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repository/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
  ) {}
  create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  findAll() {
    return this.productsRepository.findAll();
  }

  findAllFiltered(params: { visibility: 'detal' | 'mayorista' | 'client' }) {
    if (params.visibility === 'client') {
      return this.productsRepository.findAll(undefined, {
        hidePrice: true,
        hideDetails: true,
      });
    }
    if (params.visibility === 'mayorista') {
      return this.productsRepository.findAll({ productType: 'Mayorista' });
    }
    return this.productsRepository.findAll({ productType: 'Detal' });
  }

  findOne(id: number) {
    return this.productsRepository.findOne(`${id}`);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(`${id}`, updateProductDto);
  }

  remove(id: string) {
    return this.productsRepository.findOne(`${id}`);
  }
}
