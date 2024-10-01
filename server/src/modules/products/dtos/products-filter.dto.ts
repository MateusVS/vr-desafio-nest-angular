import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductFilterDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  cost?: number;
}
