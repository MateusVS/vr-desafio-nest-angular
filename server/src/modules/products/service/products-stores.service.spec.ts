import { Test, TestingModule } from '@nestjs/testing';
import { ProductsStoresServices } from './products-stores.service';
import { Repository } from 'typeorm';
import { ProductStore } from '../entity/product-store.entity';
import { Product } from '../entity/product.entity';
import { Store } from '../../stores/entity/store.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductsStoresDTO } from '../dtos/create-products-stores.dto';
import { UpdateProductsStoresDTO } from '../dtos/update-products-stores.dto';

describe('ProductsServices', () => {
  let service: ProductsStoresServices;
  let productStoreRepository: Repository<ProductStore>;
  let productRepository: Repository<Product>;
  let storeRepository: Repository<Store>;

  const mockProduct: Product = {
    id: 1,
    description: 'Test Product',
    cost: 8.99,
    image: Buffer.from('test image'),
    productStores: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStore: Store = {
    id: 1,
    description: 'Test Store',
    productStores: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsStoresServices,
        {
          provide: getRepositoryToken(ProductStore),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Store),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsStoresServices>(ProductsStoresServices);
    productStoreRepository = module.get<Repository<ProductStore>>(
      getRepositoryToken(ProductStore),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    storeRepository = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProductsStores', () => {
    it('should create a new product store successfully', async () => {
      const createDto: CreateProductsStoresDTO = {
        productId: 1,
        storeId: 1,
        salePrice: 10.99,
      };

      const mockCreatedProductStore: ProductStore = {
        id: 1,
        salePrice: createDto.salePrice,
        product: mockProduct,
        store: mockStore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(productStoreRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(storeRepository, 'findOne').mockResolvedValue(mockStore);
      jest
        .spyOn(productStoreRepository, 'create')
        .mockReturnValue(mockCreatedProductStore);
      jest
        .spyOn(productStoreRepository, 'save')
        .mockResolvedValue(mockCreatedProductStore);

      const result = await service.createProductsStores(createDto);

      expect(result).toBeDefined();
      expect(result.salePrice).toBe(createDto.salePrice);
      expect(result.product.description).toBe(mockProduct.description);
      expect(result.store.description).toBe(mockStore.description);
    });

    it('should throw ConflictException when price already exists for store', async () => {
      const createDto: CreateProductsStoresDTO = {
        productId: 1,
        storeId: 1,
        salePrice: 10.99,
      };

      const existingProductStore: ProductStore = {
        id: 1,
        salePrice: 9.99,
        product: mockProduct,
        store: mockStore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(productStoreRepository, 'findOne')
        .mockResolvedValue(existingProductStore);

      await expect(service.createProductsStores(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const createDto: CreateProductsStoresDTO = {
        productId: 999,
        storeId: 1,
        salePrice: 10.99,
      };

      jest.spyOn(productStoreRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createProductsStores(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByProductId', () => {
    it('should return an array of product stores', async () => {
      const mockStores: Store[] = [
        { ...mockStore, id: 1, description: 'Store 1' },
        { ...mockStore, id: 2, description: 'Store 2' },
      ];

      const mockProductStores: ProductStore[] = mockStores.map(
        (store, index) => ({
          id: index + 1,
          salePrice: 10.99 + index,
          product: mockProduct,
          store: store,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );

      jest
        .spyOn(productStoreRepository, 'find')
        .mockResolvedValue(mockProductStores);

      const result = await service.findByProductId(1);

      expect(result).toEqual(mockProductStores);
      expect(productStoreRepository.find).toHaveBeenCalledWith({
        where: { product: { id: 1 } },
        relations: ['store'],
      });
    });
  });

  describe('UpdateProductsStores', () => {
    it('should update a product store successfully', async () => {
      const updateDto: UpdateProductsStoresDTO = {
        salePrice: 12.99,
        storeId: 2,
      };

      const existingProductStore: ProductStore = {
        id: 1,
        salePrice: 10.99,
        product: mockProduct,
        store: mockStore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedStore: Store = {
        ...mockStore,
        id: updateDto.storeId,
        description: 'Updated Store',
      };

      const updatedProductStore: ProductStore = {
        ...existingProductStore,
        salePrice: updateDto.salePrice,
        store: updatedStore,
        updatedAt: new Date(),
      };

      jest
        .spyOn(productStoreRepository, 'findOne')
        .mockResolvedValueOnce(existingProductStore);
      jest.spyOn(productStoreRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(productStoreRepository, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(productStoreRepository, 'create')
        .mockReturnValue(updatedProductStore);

      const result = await service.updateProductsStores(1, updateDto);

      expect(result.salePrice).toBe(updateDto.salePrice);
      expect(result.store.id).toBe(updateDto.storeId);
    });

    it('should throw NotFoundException when product store does not exist', async () => {
      const updateDto: UpdateProductsStoresDTO = {
        salePrice: 12.99,
        storeId: 2,
      };

      jest.spyOn(productStoreRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateProductsStores(999, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProductStore', () => {
    it('should remove a product store successfully', async () => {
      const mockProductStore: ProductStore = {
        id: 1,
        salePrice: 10.99,
        product: mockProduct,
        store: mockStore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(productStoreRepository, 'findOne')
        .mockResolvedValue(mockProductStore);
      jest.spyOn(productStoreRepository, 'delete').mockResolvedValue(undefined);

      await service.removeProductStore(1);

      expect(productStoreRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product store does not exist', async () => {
      jest.spyOn(productStoreRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeProductStore(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
