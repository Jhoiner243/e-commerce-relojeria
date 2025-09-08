import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsOptional()
  imagen: Express.Multer.File;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
