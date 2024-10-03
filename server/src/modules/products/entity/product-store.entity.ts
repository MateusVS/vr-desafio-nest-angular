import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Store } from '../../stores/entity/store.entity';

@Entity('product_store')
export class ProductStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 13, scale: 3, name: 'sale_price' })
  salePrice: number;

  @ManyToOne(() => Product, (product) => product.productStores, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Store, (store) => store.productStores)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
