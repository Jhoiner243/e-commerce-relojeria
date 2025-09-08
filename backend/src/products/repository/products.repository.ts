/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from '@nestjs/common';
import { MayoristaOrDetal, Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../common/prisma/prisma';
import { UpdateGeneralPriceDto } from '../dto/update-general-price.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UpdateWholesaleDto } from '../dto/update-wholesale.dto';
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

  async findAllPaginated(
    take: number,
    cursor?: string,
    gender?: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
  ) {
    const cursorCondition = cursor ? { id: cursor } : undefined;

    // Build where conditions
    const whereConditions: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Add gender filter
    if (gender && gender !== 'all') {
      whereConditions.gender = gender as any;
    }

    // Add price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.precio = {};

      if (minPrice !== undefined) {
        whereConditions.precio.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        whereConditions.precio.lte = maxPrice;
      }
    }

    // Add category filter
    if (category) {
      whereConditions.categoriaName = category;
    }

    const products = await this.prisma.product.findMany({
      take: take + 1,
      cursor: cursorCondition,
      where: whereConditions,
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
        gender: product.gender,
        reference: product.id,
        mayorista: product.mayorista,
        mayoristaPrice: product.mayoristaPrice,
      })),
      nextCursor,
    };
  }
  async findAllPaginatedMayorista(
    take: number,
    cursor?: string,
    gender?: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
  ) {
    const cursorCondition = cursor ? { id: cursor } : undefined;

    // Build where conditions
    const whereConditions: Prisma.ProductWhereInput = {
      isActive: true,
      mayorista: true,
    };

    // Add gender filter
    if (gender && gender !== 'all') {
      whereConditions.gender = gender as any;
    }

    // Add price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.precio = {};

      if (minPrice !== undefined) {
        whereConditions.precio.gte = minPrice;
      }

      if (maxPrice !== undefined) {
        whereConditions.precio.lte = maxPrice;
      }
    }

    // Add category filter
    if (category) {
      whereConditions.categoriaName = category;
    }

    const products = await this.prisma.product.findMany({
      take: take + 1,
      cursor: cursorCondition,
      where: whereConditions,
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
    console.log(items);
    return {
      items: items.map((product) => ({
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        imagen: product.imagen,
        categoriaName: product.categoriaName,
        productType: product.productType,
        gender: product.gender,
        reference: product.id,
        mayorista: product.mayorista,
        mayoristaPrice: product.mayoristaPrice,
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

  async hardDelete(id: string) {
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }

  async findSeacrh(q: string) {
    return await this.prisma.product.findMany({
      where: {
        OR: [
          {
            id: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            nombre: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            descripcion: {
              contains: q,
              mode: 'insensitive',
            },
          },
        ],
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

  async updateWholesale(id: string, updateWholesaleDto: UpdateWholesaleDto) {
    const updateData: {
      mayorista: boolean;
      mayoristaPrice?: number;
    } = {
      mayorista: updateWholesaleDto.mayorista,
    };

    // Only update mayoristaPrice if it's provided
    if (updateWholesaleDto.mayoristaPrice !== undefined) {
      updateData.mayoristaPrice = updateWholesaleDto.mayoristaPrice;
    }

    return await this.prisma.product.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        categoria: true,
      },
    });
  }

  async updateGeneralPrice(
    id: string,
    updateGeneralPriceDto: UpdateGeneralPriceDto,
  ) {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        precio: updateGeneralPriceDto.precio,
      },
      include: {
        categoria: true,
      },
    });
  }
}
