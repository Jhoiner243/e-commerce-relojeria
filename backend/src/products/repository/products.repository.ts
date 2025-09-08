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
      ? { productType: filter.productType, isActive: true }
      : { isActive: true };
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
    return await this.prisma.product.findMany({ where, select });
  }

  async findAllPaginated(take: number, cursor?: string) {
    const cursorCondition = cursor ? { id: cursor } : undefined;

    const products = await this.prisma.product.findMany({
      take: take + 1,
      cursor: cursorCondition,
      where: { isActive: true },
      orderBy: {
        id: 'asc',
      },
      include: {
        categoria: true,
      },
    });

    let nextCursor: string | undefined = undefined;
    const items = products.slice(0, take);

    if (products.length > take) {
      nextCursor = products[take - 1].id;
    }

    return {
      items: items.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen: product.imagen,
        categoriaName: product.categoriaName,
        productType: product.productType,
        gender: undefined, // Not in schema yet
        reference: product.id, // Using id as reference for now
      })),
      nextCursor,
    };
  }

  async findAllWithInactive() {
    return await this.prisma.product.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categoria: true,
      },
    });
  }

  async create(createProductDto: ProductEntity) {
    return await this.prisma.product.create({
      data: createProductDto,
      include: {
        categoria: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: updateProductDto,
      include: {
        categoria: true,
      },
    });
  }

  async softDelete(id: string) {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: { isActive: false },
      include: {
        categoria: true,
      },
    });
  }

  async restore(id: string) {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: { isActive: true },
      include: {
        categoria: true,
      },
    });
  }
}
