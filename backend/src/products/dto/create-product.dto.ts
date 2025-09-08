import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MayoristaOrDetal } from '../../../generated/prisma';

export enum Gender {
  All = 'All',
  Hombre = 'Hombre',
  Mujer = 'Mujer',
  Niños = 'Niños',
  Parejas = 'Parejas',
}

export class CreateProductDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  precio: number;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  imagen?: Express.Multer.File;

  @IsString()
  categoriaName: string;

  @IsEnum(MayoristaOrDetal)
  productType: MayoristaOrDetal;

  @IsOptional()
  @IsNumber()
  mayoristaPrice?: number;

  @IsOptional()
  @IsBoolean()
  mayorista?: boolean;
}
