import { CreateProductDTO } from 'src/modules/products/dtos/create-product.dto';
import { ProductStore } from 'src/modules/products/entity/product-store.entity';
import { Product } from 'src/modules/products/entity/product.entity';
import { Store } from 'src/modules/stores/entity/store.entity';

export const mockImageString = 'test-image-data';
export const mockImageBuffer = Buffer.from(mockImageString);

export const mockStore: Store = {
  id: 1,
  description: 'Test Store',
  createdAt: new Date(),
  updatedAt: new Date(),
  productStores: [],
};

export const mockProductStore: ProductStore = {
  id: 1,
  salePrice: 150.0,
  store: mockStore,
  product: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProduct: Product = {
  id: 1,
  description: 'Test Product',
  cost: 100.0,
  image: mockImageBuffer,
  productStores: [mockProductStore],
  createdAt: new Date(),
  updatedAt: new Date(),
};

mockProductStore.product = mockProduct;

export const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn(),
};

export const mockProductRepository = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockPaginationService = {
  paginate: jest.fn(),
};

export const mockProductsStoresService = {
  createProductsStores: jest.fn(),
  findByProductId: jest.fn(),
  updateProductsStores: jest.fn(),
  removeProductStore: jest.fn(),
};

export const createMockCreateProductDTO = (
  overrides?: Partial<CreateProductDTO>,
): CreateProductDTO => ({
  description: 'Test Product',
  cost: 100.0,
  image: mockImageString,
  productStores: [
    {
      storeId: 1,
      salePrice: 150.0,
      productId: 1,
    },
  ],
  ...overrides,
});
