import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { ProductsController } from './controller/products.controller';
import { ProductsService } from './service/products.service';
import { CommonModule } from '../commom/commom.module';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
