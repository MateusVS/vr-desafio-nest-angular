import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDTO } from '../dto/pagination-query.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';

@Injectable()
export class PaginationService {
  async paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationQuery: PaginationQueryDTO,
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10, sortBy, order } = paginationQuery;

    if (sortBy) {
      queryBuilder.orderBy(sortBy, order);
    }

    const skip = (page - 1) * limit;
    const [items, totalItems] = await queryBuilder
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        sortBy,
        order,
      },
    };
  }
}
