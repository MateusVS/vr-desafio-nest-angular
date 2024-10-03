import { IsNumber, Min } from 'class-validator';

export class CreateProductsStoresDTO {
  @IsNumber()
  productId: number;

  @IsNumber()
  storeId: number;

  @IsNumber()
  @Min(0)
  salePrice: number;
}
