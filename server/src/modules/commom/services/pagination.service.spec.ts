import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from './pagination.service';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDTO, Order } from '../dto/pagination-query.dto';

type MockQueryBuilder = Partial<
  Record<keyof SelectQueryBuilder<any>, jest.Mock>
>;

describe('PaginationService', () => {
  let service: PaginationService;
  let mockQueryBuilder: MockQueryBuilder;

  beforeEach(async () => {
    mockQueryBuilder = {
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('paginate', () => {
    it('should return paginated results with default values', async () => {
      const items = [{ id: 1 }, { id: 2 }];
      const totalItems = 2;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([items, totalItems]);

      const result = await service.paginate(
        mockQueryBuilder as unknown as SelectQueryBuilder<any>,
        {},
      );

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(result).toEqual({
        items,
        meta: {
          totalItems,
          itemsPerPage: 10,
          currentPage: 1,
          totalPages: 1,
        },
      });
    });

    it('should handle custom page and limit', async () => {
      const paginationQuery: PaginationQueryDTO = {
        page: 2,
        limit: 5,
      };
      const items = [{ id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }];
      const totalItems = 15;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([items, totalItems]);

      const result = await service.paginate(
        mockQueryBuilder as unknown as SelectQueryBuilder<any>,
        paginationQuery,
      );

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(result).toEqual({
        items,
        meta: {
          totalItems,
          itemsPerPage: 5,
          currentPage: 2,
          totalPages: 3,
        },
      });
    });

    it('should handle sorting', async () => {
      const paginationQuery: PaginationQueryDTO = {
        sortBy: 'name',
        order: Order.DESC,
      };
      const items = [
        { id: 1, name: 'Z' },
        { id: 2, name: 'A' },
      ];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([items, 2]);

      await service.paginate(
        mockQueryBuilder as unknown as SelectQueryBuilder<any>,
        paginationQuery,
      );

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('name', Order.DESC);
    });

    it('should calculate total pages correctly', async () => {
      const items = Array(5).fill({ id: 1 });
      const totalItems = 21;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([items, totalItems]);

      const result = await service.paginate(
        mockQueryBuilder as unknown as SelectQueryBuilder<any>,
        { limit: 5 },
      );

      expect(result.meta.totalPages).toBe(5);
    });
  });
});
