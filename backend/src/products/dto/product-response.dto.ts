import { MayoristaOrDetal } from '../../../generated/prisma';

export class ProductResponseDto {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  categoriaName: string;
  productType: MayoristaOrDetal;
  createdAt: Date;
  updatedAt: Date;
}
