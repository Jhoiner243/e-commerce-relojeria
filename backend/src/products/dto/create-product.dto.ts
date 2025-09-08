import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MayoristaOrDetal } from '../../../generated/prisma';

export class CreateProductDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  precio: number;

  @IsOptional()
  imagen?: Express.Multer.File;

  @IsString()
  categoriaName: string;

  @IsEnum(MayoristaOrDetal)
  productType: MayoristaOrDetal;
}
