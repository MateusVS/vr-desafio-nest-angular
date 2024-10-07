import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateProductsStoresDTO } from './create-products-stores.dto';
import { Type } from 'class-transformer';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty({ message: 'A descrição do produto é obrigatória.' })
  description: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateProductsStoresDTO)
  @ArrayMinSize(1, {
    message: 'É necessário fornecer pelo menos um registro em productsStores.',
  })
  productStores: CreateProductsStoresDTO[];
}
