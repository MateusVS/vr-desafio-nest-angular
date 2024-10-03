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
  @IsNotEmpty()
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
  @ArrayMinSize(1)
  stores: CreateProductsStoresDTO[];
}
