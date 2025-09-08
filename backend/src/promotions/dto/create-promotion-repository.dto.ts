import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromotionDtoRepository {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  imagen: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
