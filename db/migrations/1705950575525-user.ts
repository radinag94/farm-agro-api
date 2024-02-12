import { UserRole } from 'src/user/user-role.enum';
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class User1705950575525 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'enum',
            enumName: 'user_role',
            enum: [UserRole.VIEWER, UserRole.OPERATOR, UserRole.OWNER],
            default: `'viewer'`,
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
      'user',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: [
          'email',
          'password',
          'role',
          'created_at',
          'updated_at',
          'deleted_at',
        ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
    await queryRunner.dropIndex('user', 'IDX_USER_EMAIL');
  }
}
