import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from './pagination.service';
import { SelectQueryBuilder } from 'typeorm';
import {
  PaginationQueryDTO,
  OrderDirection,
} from '../dto/pagination-query.dto';

describe('PaginationService', () => {
  let service: PaginationService;
  let mockQueryBuilder: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      expressionMap: {
        mainAlias: {
          name: 'entity',
        },
      },
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
          sortBy: undefined,
          order: undefined,
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
          sortBy: undefined,
          order: undefined,
        },
      });
    });

    it('should handle sorting', async () => {
      const paginationQuery: PaginationQueryDTO = {
        sortBy: 'name',
        order: OrderDirection.DESC,
      };
      const items = [
        { id: 1, name: 'Z' },
        { id: 2, name: 'A' },
      ];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([items, 2]);

      const result = await service.paginate(
        mockQueryBuilder as unknown as SelectQueryBuilder<any>,
        paginationQuery,
      );

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'entity.name',
        OrderDirection.DESC,
      );
      expect(result.meta.sortBy).toBe('name');
      expect(result.meta.order).toBe(OrderDirection.DESC);
    });

    it('should not apply sorting when mainAlias is undefined', async () => {
      mockQueryBuilder.expressionMap.mainAlias = undefined;

      const paginationQuery: PaginationQueryDTO = {
        sortBy: 'name',
        order: OrderDirection.DESC,
      };

      await service.paginate(
        mockQueryBuilder as unknown as SelectQueryBuilder<any>,
        paginationQuery,
      );

      expect(mockQueryBuilder.orderBy).not.toHaveBeenCalled();
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
      expect(result.meta).toEqual({
        totalItems: 21,
        itemsPerPage: 5,
        currentPage: 1,
        totalPages: 5,
        sortBy: undefined,
        order: undefined,
      });
    });
  });
});
