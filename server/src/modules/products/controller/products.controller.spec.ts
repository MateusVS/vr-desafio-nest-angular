import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../service/products.service';
import { Product } from '../entity/product.entity';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { ProductFilterDto } from '../dtos/products-filter.dto';
import {
  Order,
  PaginationQueryDTO,
} from '../../commom/dto/pagination-query.dto';
import { PaginatedResponse } from '../../commom/interfaces/paginated-response.interface';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockDate = new Date();
  const mockImageString = 'test-image-data';
  const mockImageBuffer = Buffer.from(mockImageString);

  const mockProduct: Product = {
    id: 1,
    description: 'Test Product',
    cost: 100.0,
    image: mockImageBuffer,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  const mockPaginatedResponse: PaginatedResponse<Product> = {
    items: [mockProduct],
    meta: {
      totalItems: 1,
      itemsPerPage: 10,
      currentPage: 1,
      totalPages: 1,
      sortBy: 'id',
      order: Order.ASC,
    },
  };

  const mockService = {
    findAllProducts: jest.fn(),
    createProduct: jest.fn(),
    findProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return filtered and paginated products when filters and pagination are provided', async () => {
      const filters: ProductFilterDto = {
        id: 1,
        description: 'Test',
        cost: 100.0,
      };

      const paginationQuery: PaginationQueryDTO = {
        page: 1,
        limit: 10,
        sortBy: 'description',
        order: Order.DESC,
      };

      jest
        .spyOn(service, 'findAllProducts')
        .mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(filters, paginationQuery);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAllProducts).toHaveBeenCalledWith(
        filters,
        paginationQuery,
      );
    });

    it('should return all products with default pagination when no parameters are provided', async () => {
      const emptyFilters: ProductFilterDto = {};
      const emptyPaginationQuery: PaginationQueryDTO = {};

      jest
        .spyOn(service, 'findAllProducts')
        .mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(
        emptyFilters,
        emptyPaginationQuery,
      );

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAllProducts).toHaveBeenCalledWith(
        emptyFilters,
        emptyPaginationQuery,
      );
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDTO = {
        description: 'New Product',
        cost: 150.0,
        image: mockImageString,
      };

      const newProduct: Product = {
        ...mockProduct,
        description: createProductDto.description,
        cost: createProductDto.cost,
        image: mockImageBuffer,
      };

      jest.spyOn(service, 'createProduct').mockResolvedValue(newProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(newProduct);
      expect(service.createProduct).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      jest.spyOn(service, 'findProductById').mockResolvedValue(mockProduct);

      const result = await controller.findById(1);

      expect(result).toEqual(mockProduct);
      expect(service.findProductById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest
        .spyOn(service, 'findProductById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDTO = {
        description: 'Updated Product',
        cost: 200.0,
        image: 'updated-image-data',
      };

      const updatedProduct: Product = {
        ...mockProduct,
        description: updateProductDto.description,
        cost: updateProductDto.cost,
        image: Buffer.from(updateProductDto.image),
      };

      jest.spyOn(service, 'updateProduct').mockResolvedValue(updatedProduct);

      const result = await controller.update(1, updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith(1, updateProductDto);
    });

    it('should throw NotFoundException when product to update is not found', async () => {
      const updateProductDto: UpdateProductDTO = {
        description: 'Updated Product',
      };

      jest
        .spyOn(service, 'updateProduct')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, updateProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'deleteProduct').mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product to delete is not found', async () => {
      jest
        .spyOn(service, 'deleteProduct')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
