import { Inject, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repository/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductsRepository)
    private readonly productsRepository: ProductsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    let imagenUrl = '';

    // Si hay una imagen, subirla a Cloudinary
    if (createProductDto.imagen) {
      try {
        imagenUrl = await this.cloudinaryService.uploadImage(
          createProductDto.imagen,
          'products',
        );
      } catch (error) {
        throw new Error(
          `Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Crear el producto con la URL de la imagen
    const productData = {
      nombre: createProductDto.nombre,
      descripcion: createProductDto.descripcion,
      precio: createProductDto.precio,
      imagen: imagenUrl,
      categoriaName: createProductDto.categoriaName,
      productType: createProductDto.productType,
    };

    const product = await this.productsRepository.create(productData);

    return {
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagenUrl: product.imagen,
      categoriaName: product.categoriaName,
      productType: product.productType,
    };
  }

  findAll() {
    return this.productsRepository.findAll();
  }

  findAllWithInactive() {
    return this.productsRepository.findAllWithInactive();
  }

  async findAllPaginated(take: number, cursor?: string) {
    return this.productsRepository.findAllPaginated(take, cursor);
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

  findOne(id: string) {
    return this.productsRepository.findOne(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(`${id}`, updateProductDto);
  }

  softDelete(id: string) {
    return this.productsRepository.softDelete(id);
  }

  restore(id: string) {
    return this.productsRepository.restore(id);
  }

  remove(id: string) {
    return this.productsRepository.findOne(`${id}`);
  }
}
