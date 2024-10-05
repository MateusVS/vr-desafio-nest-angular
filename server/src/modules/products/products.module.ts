import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { CommonModule } from '../commom/commom.module';
import { ProductStore } from './entity/product-store.entity';
import { Store } from '../stores/entity/store.entity';
import { ProductsStoresServices } from './service/products-stores.service';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Product, ProductStore, Store]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsStoresServices],
})
export class ProductsModule {}
