import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();
export const dataSourceOptions: DataSourceOptions = {
  /**
   * Database settings
   */
  type: 'postgres',
  host: 'localhost',
  port: 8000,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  synchronize: false,
  logging: Boolean(process.env.DB_LOGGING),
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
