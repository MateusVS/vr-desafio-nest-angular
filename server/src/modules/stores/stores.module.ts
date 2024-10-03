import { Module } from '@nestjs/common';
import { StoresService } from './services/stores.service';
import { StoresController } from './controller/stores.controller';
import { CommonModule } from '../commom/commom.module';
import { Store } from './entity/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Store])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
