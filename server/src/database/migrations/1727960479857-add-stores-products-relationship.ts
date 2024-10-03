import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddStoresProductsRelationship1727960479857
  implements MigrationInterface
{
  name = 'AddStoresProductsRelationship1727960479857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_store',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'sale_price',
            type: 'decimal',
            precision: 13,
            scale: 3,
          },
          {
            name: 'product_id',
            type: 'int',
          },
          {
            name: 'store_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'product_store',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'product_store',
      new TableForeignKey({
        columnNames: ['store_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'stores',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_store');
    const foreignKeys = table.foreignKeys;

    await Promise.all(
      foreignKeys.map((foreignKey) =>
        queryRunner.dropForeignKey('product_store', foreignKey),
      ),
    );

    await queryRunner.dropTable('product_store');
  }
}
