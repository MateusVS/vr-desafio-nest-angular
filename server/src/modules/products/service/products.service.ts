import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { ProductFilterDto } from '../dtos/products-filter.dto';
import { PaginationService } from '../../commom/services/pagination.service';
import { PaginationQueryDTO } from '../../commom/dto/pagination-query.dto';
import { PaginatedResponse } from '../../commom/interfaces/paginated-response.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
    private paginationServiece: PaginationService,
  ) {}

  async findAllProducts(
    filters?: ProductFilterDto,
    paginationQuery?: PaginationQueryDTO,
  ): Promise<PaginatedResponse<Product>> {
    const query = this.repository.createQueryBuilder('product');

    if (filters) {
      if (filters.id) {
        query.andWhere('product.id = :id', { id: filters.id });
      }

      if (filters.description) {
        query.andWhere('product.description ILIKE :description', {
          description: `%${filters.description}%`,
        });
      }

      if (filters.cost) {
        query.andWhere('product.cost = :cost', { cost: filters.cost });
      }
    }

    return await this.paginationServiece.paginate(query, paginationQuery || {});
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const { description, cost, image } = data;

    const product = this.repository.create({
      description,
      cost,
      image: image ? Buffer.from(image) : null,
    });

    return await this.repository.save(product);
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.repository.findOne({
      where: { id },
      relations: ['productStores', 'productStores.store'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(id: number, data: UpdateProductDTO): Promise<Product> {
    const product = await this.findProductById(id);

    const updatedData: Partial<Product> = {
      ...data,
      image: data.image ? Buffer.from(data.image) : product.image,
    };

    await this.repository.update(id, updatedData);

    return this.repository.create({ ...product, ...updatedData });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.findProductById(id);
    await this.repository.delete(id);
  }
}
