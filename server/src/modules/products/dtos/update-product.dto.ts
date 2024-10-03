import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string;
}
