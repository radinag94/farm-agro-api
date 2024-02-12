import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class GrowingPeriod1706012370751 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'growing_period',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'crop_id',
            type: 'uuid',
          },
          {
            name: 'field_id',
            type: 'uuid',
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
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'growing_period',
      new TableIndex({
        name: 'IDX_growing_period_ID',
        columnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'growing_period',
      new TableForeignKey({
        columnNames: ['crop_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'crop',
      }),
    );

    await queryRunner.createForeignKey(
      'growing_period',
      new TableForeignKey({
        columnNames: ['field_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'field',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'growing_period',
      'IDX_growing_period_NAME',
    );
    await queryRunner.dropIndex('growing_period', 'IDX_growing_period_ID');
    await queryRunner.dropTable('growing_period');
  }
}
