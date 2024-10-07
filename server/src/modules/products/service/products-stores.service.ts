import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductStore } from '../entity/product-store.entity';
import { Repository } from 'typeorm';
import { CreateProductsStoresDTO } from '../dtos/create-products-stores.dto';
import { Product } from '../entity/product.entity';
import { Store } from '../../stores/entity/store.entity';
import { UpdateProductsStoresDTO } from '../dtos/update-products-stores.dto';

@Injectable()
export class ProductsStoresServices {
  constructor(
    @InjectRepository(ProductStore)
    private repository: Repository<ProductStore>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  async createProductsStores(
    data: CreateProductsStoresDTO,
  ): Promise<ProductStore> {
    try {
      const { productId, salePrice, storeId } = data;

      await this.findExistingPrice(productId, storeId);

      await Promise.all([
        this.checkIfProductExists(productId),
        this.checkIfStoreExists(storeId),
      ]);

      const productStore = this.repository.create({
        salePrice,
        product: { id: productId },
        store: { id: storeId },
      });

      return await this.repository.save(productStore);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        );
      }
      throw error;
    }
  }

  async findByProductId(productId: number): Promise<ProductStore[]> {
    return await this.repository.find({
      where: { product: { id: productId } },
      relations: ['store'],
    });
  }

  async updateProductsStores(
    id: number,
    data: UpdateProductsStoresDTO,
  ): Promise<ProductStore> {
    try {
      const { storeId } = data;
      const productsStores = await this.findProductStoreById(id);

      if (!productsStores) {
        throw new NotFoundException(
          'O vínculo entre o produto e essa loja não existe',
        );
      }

      if (storeId) {
        await this.findExistingPrice(productsStores.product.id, storeId);
      }

      await this.repository.update(id, { ...data, store: { id: storeId } });

      return this.repository.create({ ...productsStores, ...data });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Um ou mais campos obrigatórios não foram preenchidos corretamente.',
        );
      }
      throw error;
    }
  }

  async removeProductStore(id: number): Promise<void> {
    const result = await this.findProductStoreById(id);

    if (!result) {
      throw new NotFoundException(
        'O vínculo entre o produto e essa loja não existe',
      );
    }

    await this.repository.delete(id);
  }

  private async findProductStoreById(id: number): Promise<ProductStore> {
    return await this.repository.findOne({
      where: { id },
      relations: ['product', 'store'],
    });
  }

  private async findExistingPrice(
    productId: number,
    storeId: number,
  ): Promise<void> {
    const existingPrice = await this.repository.findOne({
      where: {
        product: { id: productId },
        store: { id: storeId },
      },
    });

    if (existingPrice) {
      throw new ConflictException(
        'Não é permitido mais que um preço de venda para a mesma loja.',
      );
    }
  }

  private async checkIfProductExists(productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }
  }

  private async checkIfStoreExists(storeId: number): Promise<void> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Loja não encontrada.');
    }
  }
}
