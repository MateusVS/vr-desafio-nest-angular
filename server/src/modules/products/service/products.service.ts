import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { ProductFilterDTO } from '../dtos/products-filter.dto';
import { PaginationService } from '../../commom/services/pagination.service';
import { PaginationQueryDTO } from '../../commom/dto/pagination-query.dto';
import { PaginatedResponse } from '../../commom/interfaces/paginated-response.interface';
import { ProductsStoresServices } from './products-stores.service';
import { UpdateProductsStoresDTO } from '../dtos/update-products-stores.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
    private paginationServiece: PaginationService,
    private productsStoresService: ProductsStoresServices,
  ) {}

  async findAllProducts(
    filters?: ProductFilterDTO,
    paginationQuery?: PaginationQueryDTO,
  ): Promise<PaginatedResponse<Product>> {
    const query = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productStores', 'productStore')
      .leftJoinAndSelect('productStore.store', 'store');

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

      if (filters.salePrice) {
        query.andWhere('productStore.salePrice = :salePrice', {
          salePrice: filters.salePrice,
        });
      }
    }

    return await this.paginationServiece.paginate(query, paginationQuery || {});
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const { description, cost, image, productsStores } = data;

    if (!productsStores || productsStores.length === 0) {
      throw new BadRequestException(
        'Pelo menos um preço de loja deve ser fornecido para o produto.',
      );
    }

    const product = this.repository.create({
      description,
      cost,
      image: image ? Buffer.from(image) : null,
    });

    const savedProduct = await this.repository.save(product);

    await Promise.all(
      productsStores.map(({ storeId, salePrice }) =>
        this.productsStoresService.createProductsStores({
          productId: savedProduct.id,
          storeId,
          salePrice,
        }),
      ),
    );

    return this.findProductById(savedProduct.id);
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.repository.findOne({
      where: { id },
      relations: ['productStores', 'productStores.store'],
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
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

    if (data.productsStores !== undefined) {
      if (data.productsStores.length === 0) {
        throw new BadRequestException(
          'Não é possível remover todos os preços das lojas. Pelo menos um deve permanecer.',
        );
      }
      await this.updateProductStores(id, data.productsStores);
    }

    return this.findProductById(id);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.findProductById(id);
    await this.repository.delete(id);
  }

  private async updateProductStores(
    productId: number,
    productsStores: UpdateProductsStoresDTO[],
  ): Promise<void> {
    const existingProductsStores =
      await this.productsStoresService.findByProductId(productId);

    const existingProductsStoresMap = new Map(
      existingProductsStores.map((store) => [store.store.id, store]),
    );

    const newProductsStoresMap = new Map(
      productsStores.map((store) => [store.storeId, store]),
    );

    const storesToUpdate = existingProductsStores
      .filter(({ store }) => newProductsStoresMap.has(store.id))
      .map(({ id, salePrice, store }) => {
        const newStore = newProductsStoresMap.get(store.id)!;
        return newStore.salePrice !== salePrice
          ? { id, salePrice: newStore.salePrice }
          : null;
      })
      .filter(Boolean) as Array<{ id: number; salePrice: number }>;

    const storesToRemove = existingProductsStores
      .filter(({ store }) => !newProductsStoresMap.has(store.id))
      .map(({ id }) => id);

    const storesToAdd = productsStores
      .filter(({ storeId }) => !existingProductsStoresMap.has(storeId))
      .map(({ storeId, salePrice }) => ({ storeId, salePrice }));

    await Promise.all([
      ...storesToUpdate.map(({ id, salePrice }) =>
        this.productsStoresService.updateProductsStores(id, { salePrice }),
      ),
      ...storesToRemove.map((id) =>
        this.productsStoresService.removeProductStore(id),
      ),
      ...storesToAdd.map(({ storeId, salePrice }) =>
        this.productsStoresService.createProductsStores({
          productId,
          storeId,
          salePrice,
        }),
      ),
    ]);
  }
}
