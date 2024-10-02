import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { Store } from '../entity/store.entity';
import { PaginatedResponse } from '../../commom/interfaces/paginated-response.interface';
import { PaginationQueryDTO } from '../../commom/dto/pagination-query.dto';
import { CreateStoreDTO } from '../dtos/create-store.dto';
import { UpdateStoreDTO } from '../dtos/update-store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @HttpCode(200)
  async findAll(
    @Query() filter: string,
    @Query() paginationQuery: PaginationQueryDTO,
  ): Promise<PaginatedResponse<Store>> {
    return await this.storesService.findAllStores(filter, paginationQuery);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: CreateStoreDTO): Promise<Store> {
    return await this.storesService.createStore(data);
  }

  @Get(':id')
  @HttpCode(200)
  async findById(@Param('id') id: number): Promise<Store> {
    return await this.storesService.findStoreById(id);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: number,
    @Body() data: UpdateStoreDTO,
  ): Promise<Store> {
    return this.storesService.updateStore(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.storesService.deleteStore(id);
  }
}
