import { CreateStoreDTO } from 'src/modules/stores/dtos/create-store.dto';

export const mockStore = {
  id: 1,
  description: 'Test Store',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn(),
  getManyAndCount: jest.fn(),
};

export const mockStoreRepository = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
};

export const mockStoresService = {
  findAllStores: jest.fn(),
  createStore: jest.fn(),
  findStoreById: jest.fn(),
  updateStore: jest.fn(),
  deleteStore: jest.fn(),
};

export const mockPaginationService = {
  paginate: jest.fn(),
};

export const createMockStore = (overrides?: Partial<typeof mockStore>) => ({
  ...mockStore,
  ...overrides,
});

export const createMockCreateStoreDTO = (
  description: string = 'Test Store',
): CreateStoreDTO => ({
  description,
});
