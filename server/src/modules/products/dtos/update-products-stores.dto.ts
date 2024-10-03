import { IsNumber, IsOptional } from 'class-validator';

export class UpdateProductsStoresDTO {
  @IsNumber()
  @IsOptional()
  storeId?: number;

  @IsNumber()
  @IsOptional()
  salePrice?: number;
}
