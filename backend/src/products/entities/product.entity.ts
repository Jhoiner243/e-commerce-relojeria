import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MayoristaOrDetal } from '../../../generated/prisma';
import { Gender } from '../dto/create-product.dto';

export class ProductEntity {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsString()
  imagen: string;

  @IsString()
  categoriaName: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(MayoristaOrDetal)
  productType: MayoristaOrDetal;

  @IsOptional()
  @IsNumber()
  mayoristaPrice?: number;

  @IsOptional()
  @IsBoolean()
  mayorista?: boolean;
}
