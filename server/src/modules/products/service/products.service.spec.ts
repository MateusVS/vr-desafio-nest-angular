import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { UpdateProductDTO } from '../dtos/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

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

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllProducts', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [mockProduct];
      jest.spyOn(repository, 'find').mockResolvedValue(products);

      const result = await service.findAllProducts();

      expect(result).toEqual(products);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
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

      jest.spyOn(repository, 'create').mockReturnValue(newProduct);
      jest.spyOn(repository, 'save').mockResolvedValue(newProduct);

      const result = await service.createProduct(createProductDto);

      expect(repository.create).toHaveBeenCalledWith({
        description: createProductDto.description,
        cost: createProductDto.cost,
        image: mockImageBuffer,
      });
      expect(result).toEqual(newProduct);
      expect(repository.save).toHaveBeenCalledWith(newProduct);
    });

    it('should create a product with null image when image is not provided', async () => {
      const createProductDto: CreateProductDTO = {
        description: 'New Product',
        cost: 150.0,
      };

      const newProduct: Product = {
        ...mockProduct,
        description: createProductDto.description,
        cost: createProductDto.cost,
        image: null,
      };

      jest.spyOn(repository, 'create').mockReturnValue(newProduct);
      jest.spyOn(repository, 'save').mockResolvedValue(newProduct);

      const result = await service.createProduct(createProductDto);

      expect(repository.create).toHaveBeenCalledWith({
        description: createProductDto.description,
        cost: createProductDto.cost,
        image: null,
      });
      expect(result).toEqual(newProduct);
    });
  });

  describe('findProductById', () => {
    it('should return a product by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.findProductById(1);

      expect(result).toEqual(mockProduct);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findProductById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProduct', () => {
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

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'create').mockReturnValue(updatedProduct);

      const result = await service.updateProduct(1, updateProductDto);

      expect(repository.update).toHaveBeenCalledWith(1, {
        description: updateProductDto.description,
        cost: updateProductDto.cost,
        image: Buffer.from(updateProductDto.image),
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should keep existing image if no new image is provided in update', async () => {
      const updateProductDto: UpdateProductDTO = {
        description: 'Updated Product',
        cost: 200.0,
      };

      const updatedProduct: Product = {
        ...mockProduct,
        description: updateProductDto.description,
        cost: updateProductDto.cost,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'create').mockReturnValue(updatedProduct);

      const result = await service.updateProduct(1, updateProductDto);

      expect(repository.update).toHaveBeenCalledWith(1, {
        description: updateProductDto.description,
        cost: updateProductDto.cost,
        image: mockProduct.image,
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException when product to update is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateProduct(999, { description: 'Updated Product' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.deleteProduct(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(repository.delete).toHaveBeenCalledWith(1);
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
