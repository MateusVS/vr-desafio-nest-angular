import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductStore } from './product-store.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  description: string;

  @Column('decimal', { precision: 13, scale: 3, nullable: true })
  cost: number;

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @OneToMany(() => ProductStore, (productStore) => productStore.product, {
    cascade: true,
  })
  productStores: ProductStore[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
