import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDTO {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  image?: string;
}
