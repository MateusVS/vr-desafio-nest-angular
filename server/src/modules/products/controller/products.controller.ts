import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from '../service/products.service';
import { Product } from '../entity/product.entity';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAllProducts();
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
