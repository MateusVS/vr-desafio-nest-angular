import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from '../service/products.service';
import {
  mockProduct,
  createMockCreateProductDTO,
} from '../../../../test/utils/product-test.utils';
import { UpdateProductDTO } from '../dtos/update-product.dto';
import { ProductFilterDTO } from '../dtos/products-filter.dto';
import {
  PaginationQueryDTO,
  Order,
} from '../../commom/dto/pagination-query.dto';
import { PaginatedResponse } from '../../commom/interfaces/paginated-response.interface';
import { Product } from '../entity/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAllProducts: jest.fn(),
            createProduct: jest.fn(),
            findProductById: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
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
    it('should return a paginated list of products', async () => {
      const filters: ProductFilterDTO = {
        description: 'test',
        cost: 50,
        salePrice: 100,
      };
      const paginationQuery: PaginationQueryDTO = {
        page: 1,
        limit: 10,
        sortBy: 'description',
        order: Order.ASC,
      };
      const expectedResponse: PaginatedResponse<Product> = {
        items: [mockProduct],
        meta: {
          totalItems: 1,
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 1,
          sortBy: 'description',
          order: Order.ASC,
        },
      };

      jest
        .spyOn(service, 'findAllProducts')
        .mockResolvedValue(expectedResponse);

      const result = await controller.findAll(filters, paginationQuery);

      expect(result).toEqual(expectedResponse);
      expect(service.findAllProducts).toHaveBeenCalledWith(
        filters,
        paginationQuery,
      );
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDTO = createMockCreateProductDTO();
      jest.spyOn(service, 'createProduct').mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDTO);

      expect(result).toEqual(mockProduct);
      expect(service.createProduct).toHaveBeenCalledWith(createProductDTO);
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const productId = 1;
      jest.spyOn(service, 'findProductById').mockResolvedValue(mockProduct);

      const result = await controller.findById(productId);

      expect(result).toEqual(mockProduct);
      expect(service.findProductById).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = 1;
      const updateProductDTO: UpdateProductDTO = {
        description: 'Updated Product',
        cost: 120.0,
        productsStores: [
          {
            storeId: 1,
            salePrice: 150.0,
          },
        ],
      };

      const updatedProduct: Product = {
        ...mockProduct,
        description: updateProductDTO.description,
        cost: updateProductDTO.cost,
      };

      jest.spyOn(service, 'updateProduct').mockResolvedValue(updatedProduct);

      const result = await controller.update(productId, updateProductDTO);

      expect(result).toEqual(updatedProduct);
      expect(service.updateProduct).toHaveBeenCalledWith(
        productId,
        updateProductDTO,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = 1;
      jest.spyOn(service, 'deleteProduct').mockResolvedValue(undefined);

      await controller.remove(productId);

      expect(service.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });
});
