import { IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateProductsStoresDTO {
  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsNumber()
  @IsNotEmpty({ message: 'O ID da loja é obrigatório' })
  storeId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'O preço de venda é obrigatório' })
  @Min(0, { message: 'O preço de venda deve ser maior ou igual a zero' })
  salePrice: number;
}
