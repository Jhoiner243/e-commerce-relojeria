import { IsNumber, IsString } from 'class-validator';
import { MayoristaOrDetal } from '../../../generated/prisma';

export class CreateProductDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  imagen: Express.Multer.File;

  @IsString()
  categoriaName: string;

  @IsString()
  productType: MayoristaOrDetal;
}
