import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class FieldProcess1706013812063 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'field_process',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'p_date',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'machine_id',
            type: 'uuid',
          },
          {
            name: 'process_type_id',
            type: 'uuid',
          },
          {
            name: 'growing_period_id',
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
      'field_process',
      new TableIndex({
        name: 'IDX_field_process_ID',
        columnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'field_process',
      new TableForeignKey({
        columnNames: ['machine_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'machine',
      }),
    );

    await queryRunner.createForeignKey(
      'field_process',
      new TableForeignKey({
        columnNames: ['process_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'process_type',
      }),
    );

    await queryRunner.createForeignKey(
      'field_process',
      new TableForeignKey({
        columnNames: ['growing_period_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'growing_period',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('field_process', 'IDX_field_process_ID');
    await queryRunner.dropIndex('field_process', 'IDX_field_process_ID');
    await queryRunner.dropTable('field_process');
  }
}
