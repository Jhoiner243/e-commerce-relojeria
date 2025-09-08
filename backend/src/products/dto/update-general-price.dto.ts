import { IsNumber } from 'class-validator';

export class UpdateGeneralPriceDto {
  @IsNumber()
  precio: number;
}
