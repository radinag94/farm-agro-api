import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Machine1706013299052 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'machine',
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
            name: 'brand',
            type: 'varchar',
          },
          {
            name: 'register_number',
            type: 'varchar',
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
      'machine',
      new TableIndex({
        name: 'IDX_MACHINE_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createForeignKey(
      'machine',
      new TableForeignKey({
        columnNames: ['farm_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'farm',
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('machine', 'IDX_MACHINE_NAME');
    await queryRunner.dropIndex('machine', 'IDX_MACHINE_NAME');
    await queryRunner.dropTable('machine');
  }
}
