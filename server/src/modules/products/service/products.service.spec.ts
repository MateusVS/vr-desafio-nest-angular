/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProductFilterDTO } from '../dtos/products-filter.dto';
import {
  OrderDirection,
  PaginationQueryDTO,
} from '../../commom/dto/pagination-query.dto';
import { PaginationService } from '../../commom/services/pagination.service';
import { ProductsStoresServices } from './products-stores.service';
import {
  createMockCreateProductDTO,
  mockProduct,
  mockProductRepository,
  mockProductsStoresService,
  mockPaginationService,
  mockQueryBuilder,
} from '../../../../test/utils/product-test.utils';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;
  let productStoresService: ProductsStoresServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
        {
          provide: ProductsStoresServices,
          useValue: mockProductsStoresService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    productStoresService = module.get<ProductsStoresServices>(
      ProductsStoresServices,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllProducts', () => {
    it('should apply all filters and use pagination service', async () => {
      const filters: ProductFilterDTO = {
        id: 1,
        description: 'Test',
        cost: 100.0,
        salePrice: 150.0,
      };

      const paginationQuery: PaginationQueryDTO = {
        page: 2,
        limit: 10,
        sortBy: 'description',
        order: OrderDirection.DESC,
      };

      const mockPaginatedResponse = {
        items: [mockProduct],
        meta: {
          totalItems: 1,
          itemsPerPage: 10,
          currentPage: 2,
          totalPages: 1,
          sortBy: 'description',
          order: OrderDirection.DESC,
        },
      };

      mockPaginationService.paginate.mockResolvedValue(mockPaginatedResponse);

      const result = await service.findAllProducts(filters, paginationQuery);

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'product.productStores',
        'productStore',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'productStore.store',
        'store',
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.id = :id',
        { id: filters.id },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.description ILIKE :description',
        { description: `%${filters.description}%` },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'product.cost = :cost',
        { cost: filters.cost },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'productStore.salePrice = :salePrice',
        { salePrice: filters.salePrice },
      );

      expect(mockPaginationService.paginate).toHaveBeenCalledWith(
        mockQueryBuilder,
        paginationQuery,
      );

      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('createProduct', () => {
    it('should create a product with store prices', async () => {
      const createProductDto = createMockCreateProductDTO();
      const newProduct = { ...mockProduct, id: undefined };

      mockProductRepository.create.mockReturnValue(newProduct);
      mockProductRepository.save.mockResolvedValue({ ...mockProduct });
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto);

      expect(mockProductRepository.create).toHaveBeenCalledWith({
        description: createProductDto.description,
        cost: createProductDto.cost,
        image: createProductDto.image
          ? Buffer.from(createProductDto.image)
          : null,
      });
      expect(
        mockProductsStoresService.createProductsStores,
      ).toHaveBeenCalledWith({
        productId: mockProduct.id,
        storeId: createProductDto.productStores[0].storeId,
        salePrice: createProductDto.productStores[0].salePrice,
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update product data and store prices', async () => {
      const updateProductDto = {
        description: 'Updated Product',
        cost: 150.0,
        image: 'newImageBase64',
        productStores: [
          { storeId: 1, salePrice: 200.0 },
          { storeId: 2, salePrice: 220.0 },
        ],
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductsStoresService.findByProductId.mockResolvedValue([
        { id: 1, store: { id: 1 }, salePrice: 180.0 },
      ]);

      await service.updateProduct(1, updateProductDto);

      expect(mockProductRepository.update).toHaveBeenCalledWith(1, {
        description: updateProductDto.description,
        cost: updateProductDto.cost,
        image: Buffer.from(updateProductDto.image),
      });

      expect(mockProductsStoresService.updateProductsStores).toHaveBeenCalled();
      expect(
        mockProductsStoresService.removeProductStore,
      ).not.toHaveBeenCalled();
      expect(mockProductsStoresService.createProductsStores).toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to remove all store prices', async () => {
      const updateProductDto = {
        description: 'Updated Product',
        productStores: [],
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(service.updateProduct(1, updateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findProductById', () => {
    it('should return a product by id with base64 image', async () => {
      const productWithImage = {
        ...mockProduct,
        image: Buffer.from('testImage'),
      };
      mockProductRepository.findOne.mockResolvedValue(productWithImage);

      const result = await service.findProductById(1);

      expect(result.imageBase64).toBe(
        productWithImage.image.toString('base64'),
      );
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['productStores', 'productStores.store'],
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
