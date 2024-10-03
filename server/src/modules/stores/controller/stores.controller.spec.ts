import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from '../services/stores.service';
import { CreateStoreDTO } from '../dtos/create-store.dto';
import { UpdateStoreDTO } from '../dtos/update-store.dto';
import { PaginationQueryDTO } from '../../commom/dto/pagination-query.dto';

describe('StoresController', () => {
  let controller: StoresController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: StoresService;

  const mockStore = {
    id: 1,
    description: 'Test Store',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockStoresService = {
    findAllStores: jest.fn(),
    createStore: jest.fn(),
    findStoreById: jest.fn(),
    updateStore: jest.fn(),
    deleteStore: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: mockStoresService,
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of stores', async () => {
      const filter = 'test';
      const paginationQuery: PaginationQueryDTO = {
        page: 1,
        limit: 10,
      };
      const expectedResult = {
        items: [mockStore],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockStoresService.findAllStores.mockResolvedValue(expectedResult);

      const result = await controller.findAll(filter, paginationQuery);

      expect(result).toEqual(expectedResult);
      expect(mockStoresService.findAllStores).toHaveBeenCalledWith(
        filter,
        paginationQuery,
      );
    });
  });

  describe('create', () => {
    it('should create a new store', async () => {
      const createStoreDto: CreateStoreDTO = {
        description: 'New Test Store',
      };

      mockStoresService.createStore.mockResolvedValue({
        ...mockStore,
        description: createStoreDto.description,
      });

      const result = await controller.create(createStoreDto);

      expect(result).toEqual({
        ...mockStore,
        description: createStoreDto.description,
      });
      expect(mockStoresService.createStore).toHaveBeenCalledWith(
        createStoreDto,
      );
    });
  });

  describe('findById', () => {
    it('should return a store by id', async () => {
      mockStoresService.findStoreById.mockResolvedValue(mockStore);

      const result = await controller.findById(1);

      expect(result).toEqual(mockStore);
      expect(mockStoresService.findStoreById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a store', async () => {
      const updateStoreDto: UpdateStoreDTO = {
        description: 'Updated Test Store',
      };

      mockStoresService.updateStore.mockResolvedValue({
        ...mockStore,
        description: updateStoreDto.description,
      });

      const result = await controller.update(1, updateStoreDto);

      expect(result).toEqual({
        ...mockStore,
        description: updateStoreDto.description,
      });
      expect(mockStoresService.updateStore).toHaveBeenCalledWith(
        1,
        updateStoreDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a store', async () => {
      mockStoresService.deleteStore.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockStoresService.deleteStore).toHaveBeenCalledWith(1);
    });
  });
});
