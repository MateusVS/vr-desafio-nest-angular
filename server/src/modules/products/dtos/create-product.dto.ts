import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  image?: string;
}
