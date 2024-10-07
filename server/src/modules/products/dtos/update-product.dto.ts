import { Type } from 'class-transformer';
import { UpdateProductsStoresDTO } from './update-products-stores.dto';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional({ message: 'A descrição do produto é obrigatória.' })
  description?: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string;

  @ValidateNested({ each: true })
  @Type(() => UpdateProductsStoresDTO)
  @ArrayMinSize(1, {
    message: 'É necessário fornecer pelo menos um registro em productsStores.',
  })
  productStores: UpdateProductsStoresDTO[];
}
