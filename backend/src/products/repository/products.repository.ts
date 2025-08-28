import { Inject, Injectable } from '@nestjs/common';
import { MayoristaOrDetal, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async findAll(
    filter?: { productType?: MayoristaOrDetal },
    selectFields?: { hidePrice?: boolean; hideDetails?: boolean },
  ) {
    const where: Prisma.ProductWhereInput | undefined = filter?.productType
      ? { productType: filter.productType }
      : undefined;
    const select: Prisma.ProductSelect | undefined = selectFields
      ? {
          id: true,
          nombre: true,
          imagen: true,
          precio: selectFields.hidePrice ? false : true,
          productType: selectFields.hideDetails ? false : true,
          categoriaName: selectFields.hideDetails ? false : true,
        }
      : undefined;
    return this.prisma.product.findMany({ where, select });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async create(createProductDto: ProductEntity) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }
}
