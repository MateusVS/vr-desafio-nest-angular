import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1727806298978 implements MigrationInterface {
  name = 'CreateProductsTable1727806298978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '60',
            isNullable: false,
          },
          {
            name: 'cost',
            type: 'decimal',
            precision: 13,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'image',
            type: 'bytea',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
