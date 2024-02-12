import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Field1705997066742 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'field',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'shape',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'field_area',
            type: 'int',
          },
          {
            name: 'soil_id',
            type: 'uuid',
          },
          {
            name: 'farm_id',
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
      'field',
      new TableIndex({
        name: 'IDX_FIELD_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createForeignKey(
      'field',
      new TableForeignKey({
        columnNames: ['soil_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'soil',
      }),
    );

    await queryRunner.createForeignKey(
      'field',
      new TableForeignKey({
        columnNames: ['farm_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'farm',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('field', 'IDX_FIELD_NAME');
    await queryRunner.dropIndex('field', 'IDX_FIELD_NAME');
    await queryRunner.dropTable('field');
  }
}
