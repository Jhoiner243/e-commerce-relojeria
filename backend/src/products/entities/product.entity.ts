import { MayoristaOrDetal } from '../../../generated/prisma';

export class ProductEntity {
  nombre: string;
  precio: number;
  imagen: string;
  categoriaName: string;
  productType: MayoristaOrDetal;
}
