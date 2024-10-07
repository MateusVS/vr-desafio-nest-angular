import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateProductsStoresDTO {
  @IsNumber()
  @IsOptional()
  storeId?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'O preço de venda deve ser maior ou igual a zero' })
  salePrice?: number;

  @IsNotEmpty()
  @IsOptional()
  id?: number;
}
