import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { dataSourceOptions } from './database/data-source';
import { PaginationService } from './modules/commom/services/pagination.service';
import { CommonModule } from './modules/commom/commom.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CommonModule,
    ProductsModule,
  ],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class AppModule {}
