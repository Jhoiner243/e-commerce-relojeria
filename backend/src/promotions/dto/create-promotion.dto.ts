import { IsString, Length } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  type: 'promotion' | 'collection' | 'featured';

  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @Length(1, 30)
  subtitle: string;

  @IsString()
  @Length(1, 30)
  description: string;

  @IsString()
  @Length(1, 10)
  buttonText: string;

  @IsString()
  image: string;
}
