import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedStoreTable1728160405099 implements MigrationInterface {
  name = 'SeedStoreTable1728160405099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO stores (description, created_at, updated_at)
        VALUES
        ('Loja 1', NOW(), NOW()),
        ('Loja 2', NOW(), NOW()),
        ('Loja 3', NOW(), NOW())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM stores WHERE description IN ('Loja 1', 'Loja 2', 'Loja 3')`,
    );
  }
}
