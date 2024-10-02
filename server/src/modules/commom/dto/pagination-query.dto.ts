import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDTO {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsEnum(Order)
  order?: Order = Order.ASC;
}
