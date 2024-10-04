import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductFilterDTO } from '../dtos/products-filter.dto';
import {
  Order,
  PaginationQueryDTO,
} from '../../commom/dto/pagination-query.dto';
import { PaginationService } from '../../commom/services/pagination.service';
import { ProductsStoresServices } from './products-stores.service';
import {
  createMockCreateProductDTO,
  mockImageBuffer,
  mockProduct,
  mockProductRepository,
  mockProductsStoresService,
  mockPaginationService,
  mockQueryBuilder,
} from '../../../../test/utils/product-test.utils';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productsStoresService: ProductsStoresServices;

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
    productsStoresService = module.get<ProductsStoresServices>(
      ProductsStoresServices,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should apply all filters and use pagination service', async () => {
    const filters: ProductFilterDTO = {
      id: 1,
      description: 'Test',
      cost: 100.0,
    };

    const paginationQuery: PaginationQueryDTO = {
      page: 2,
      limit: 10,
      sortBy: 'description',
      order: Order.DESC,
    };

    const mockPaginatedResponse = {
      items: [mockProduct],
      meta: {
        totalItems: 1,
        itemsPerPage: 10,
        currentPage: 2,
        totalPages: 1,
        sortBy: 'description',
        order: Order.DESC,
      },
    };

    mockPaginationService.paginate.mockResolvedValue(mockPaginatedResponse);

    const result = await service.findAllProducts(filters, paginationQuery);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.id = :id', {
      id: filters.id,
    });
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'product.description ILIKE :description',
      {
        description: `%${filters.description}%`,
      },
    );
    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'product.cost = :cost',
      { cost: filters.cost },
    );

    expect(mockPaginationService.paginate).toHaveBeenCalledWith(
      mockQueryBuilder,
      paginationQuery,
    );

    expect(result).toEqual(mockPaginatedResponse);
  });

  it('should not apply filters when none are provided but still use pagination', async () => {
    const paginationQuery: PaginationQueryDTO = {
      page: 1,
      limit: 10,
    };

    const mockPaginatedResponse = {
      items: [mockProduct],
      meta: {
        totalItems: 1,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 1,
      },
    };

    mockPaginationService.paginate.mockResolvedValue(mockPaginatedResponse);

    const result = await service.findAllProducts({}, paginationQuery);

    expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    expect(mockPaginationService.paginate).toHaveBeenCalledWith(
      mockQueryBuilder,
      paginationQuery,
    );
    expect(result).toEqual(mockPaginatedResponse);
  });

  it('should use default pagination when no pagination query is provided', async () => {
    const mockPaginatedResponse = {
      items: [mockProduct],
      meta: {
        totalItems: 1,
        itemsPerPage: 10,
        currentPage: 1,
        totalPages: 1,
      },
    };

    mockPaginationService.paginate.mockResolvedValue(mockPaginatedResponse);

    const result = await service.findAllProducts({});

    expect(mockPaginationService.paginate).toHaveBeenCalledWith(
      mockQueryBuilder,
      {},
    );
    expect(result).toEqual(mockPaginatedResponse);
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
        image: mockImageBuffer,
      });
      expect(
        mockProductsStoresService.createProductsStores,
      ).toHaveBeenCalledWith({
        productId: mockProduct.id,
        storeId: createProductDto.productsStores[0].storeId,
        salePrice: createProductDto.productsStores[0].salePrice,
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw BadRequestException when no store prices are provided', async () => {
      const createProductDto = createMockCreateProductDTO({
        productsStores: [],
      });

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findProductById', () => {
    it('should return a product by id', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      const result = await service.findProductById(1);

      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['productStores', 'productStores.store'],
      });
    });

    it('should throw NotFoundException when product is not found', async () => {
      mockProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findProductById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update product and store prices', async () => {
      const updateProductDto = {
        description: 'Updated Product',
        productsStores: [
          { storeId: 1, salePrice: 200.0 },
          { storeId: 2, salePrice: 220.0 },
        ],
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockProductsStoresService.findByProductId.mockResolvedValue([
        mockProduct.productStores[0],
      ]);

      await service.updateProduct(1, updateProductDto);

      expect(mockProductRepository.update).toHaveBeenCalledWith(1, {
        description: updateProductDto.description,
        image: mockProduct.image,
        productsStores: updateProductDto.productsStores,
      });
      expect(mockProductsStoresService.findByProductId).toHaveBeenCalledWith(1);
      expect(mockProductsStoresService.updateProductsStores).toHaveBeenCalled();
      expect(mockProductsStoresService.createProductsStores).toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to remove all store prices', async () => {
      const updateProductDto = {
        description: 'Updated Product',
        productsStores: [],
      };

      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await expect(service.updateProduct(1, updateProductDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductRepository.findOne.mockResolvedValue(mockProduct);

      await service.deleteProduct(1);

      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['productStores', 'productStores.store'],
      });
      expect(mockProductRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product to delete is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteProduct(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
