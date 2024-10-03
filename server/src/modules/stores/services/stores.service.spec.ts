import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoresService } from './stores.service';
import { Store } from '../entity/store.entity';
import { PaginationService } from '../../commom/services/pagination.service';
import { NotFoundException } from '@nestjs/common';

describe('StoresService', () => {
  let service: StoresService;
  let repository: Repository<Store>;
  let paginationService: PaginationService;

  const mockStore = {
    id: 1,
    description: 'Test Store',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  const mockPaginationService = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    repository = module.get<Repository<Store>>(getRepositoryToken(Store));
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllStores', () => {
    it('should return paginated stores without filter', async () => {
      const paginationQuery = { page: 1, limit: 10 };
      const expectedResult = {
        items: [mockStore],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockPaginationService.paginate.mockResolvedValue(expectedResult);

      const result = await service.findAllStores(undefined, paginationQuery);

      expect(result).toEqual(expectedResult);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('store');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(paginationService.paginate).toHaveBeenCalledWith(
        mockQueryBuilder,
        paginationQuery,
      );
    });

    it('should return filtered paginated stores', async () => {
      const filter = 'test';
      const paginationQuery = { page: 1, limit: 10 };
      const expectedResult = {
        items: [mockStore],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockPaginationService.paginate.mockResolvedValue(expectedResult);

      const result = await service.findAllStores(filter, paginationQuery);

      expect(result).toEqual(expectedResult);
      expect(repository.createQueryBuilder).toHaveBeenCalledWith('store');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'store.id = :filter OR store.description ILIKE :filter',
        { filter: 'test' },
      );
    });
  });

  describe('createStore', () => {
    it('should create a new store', async () => {
      const createStoreDto = { description: 'New Test Store' };
      mockRepository.save.mockResolvedValue(mockStore);

      const result = await service.createStore(createStoreDto);

      expect(result).toEqual(mockStore);
      expect(repository.save).toHaveBeenCalledWith(createStoreDto);
    });
  });

  describe('findStoreById', () => {
    it('should return a store if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockStore);

      const result = await service.findStoreById(1);

      expect(result).toEqual(mockStore);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if store not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findStoreById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStore', () => {
    it('should update a store', async () => {
      const updateStoreDto = { description: 'Updated Test Store' };
      mockRepository.findOne.mockResolvedValue(mockStore);
      mockRepository.create.mockReturnValue({
        ...mockStore,
        ...updateStoreDto,
      });

      const result = await service.updateStore(1, updateStoreDto);

      expect(result).toEqual({ ...mockStore, ...updateStoreDto });
      expect(repository.update).toHaveBeenCalledWith(1, updateStoreDto);
    });

    it('should throw NotFoundException if store to update not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStore(999, { description: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteStore', () => {
    it('should delete a store', async () => {
      mockRepository.findOne.mockResolvedValue(mockStore);

      await service.deleteStore(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if store to delete not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteStore(999)).rejects.toThrow(NotFoundException);
    });
  });
});
