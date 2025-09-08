import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateWholesaleDto {
  @IsBoolean()
  mayorista: boolean;

  @IsNumber()
  @IsOptional()
  mayoristaPrice?: number;
}
