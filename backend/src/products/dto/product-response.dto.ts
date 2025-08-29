import { MayoristaOrDetal } from '../../../generated/prisma';

export class ProductResponseDto {
  id: string;
  nombre: string;
  precio: number;
  imagenUrl: string;
  categoriaName: string;
  productType: MayoristaOrDetal;
}
