import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductFilterDTO {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsNumber()
  @IsOptional()
  salePrice?: number;
}
