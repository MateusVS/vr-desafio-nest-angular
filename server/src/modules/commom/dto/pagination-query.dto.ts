import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationQueryDTO {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsEnum(OrderDirection)
  @IsOptional()
  order?: OrderDirection;
}
