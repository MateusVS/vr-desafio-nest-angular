import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { Product } from '../entity/product.entity';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { ProductFilterDto } from '../dtos/products-filter.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query() filters: ProductFilterDto): Promise<Product[]> {
    return await this.productsService.findAllProducts(filters);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateProductDTO): Promise<Product> {
    return await this.productsService.createProduct(data);
  }

  @Get(':id')
  @HttpCode(200)
  async findById(@Param('id') id: number): Promise<Product> {
    return await this.productsService.findProductById(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() data: UpdateProductDTO,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.productsService.deleteProduct(id);
  }
}
