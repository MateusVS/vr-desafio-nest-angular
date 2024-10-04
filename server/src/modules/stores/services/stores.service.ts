import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../entity/store.entity';
import { Repository } from 'typeorm';
import { PaginationService } from '../../commom/services/pagination.service';
import { UpdateStoreDTO } from '../dtos/update-store.dto';
import { CreateStoreDTO } from '../dtos/create-store.dto';
import { PaginationQueryDTO } from '../../commom/dto/pagination-query.dto';
import { PaginatedResponse } from '../../commom/interfaces/paginated-response.interface';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private repository: Repository<Store>,
    private paginationServiece: PaginationService,
  ) {}

  async findAllStores(
    filter?: string,
    paginationQuery?: PaginationQueryDTO,
  ): Promise<PaginatedResponse<Store>> {
    const query = this.repository.createQueryBuilder('store');

    if (filter) {
      query.andWhere('store.id = :filter OR store.description ILIKE :filter', {
        filter: `${filter}`,
      });
    }

    return await this.paginationServiece.paginate(query, paginationQuery || {});
  }

  async createStore(data: CreateStoreDTO): Promise<Store> {
    return await this.repository.save(data);
  }

  async findStoreById(id: number): Promise<Store> {
    const store = await this.repository.findOne({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }

    return store;
  }

  async updateStore(id: number, data: UpdateStoreDTO): Promise<Store> {
    await this.findStoreById(id);
    await this.repository.update(id, data);

    return this.repository.create(data);
  }

  async deleteStore(id: number): Promise<void> {
    await this.findStoreById(id);
    await this.repository.delete(id);
  }
}
