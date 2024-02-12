import { Farm } from 'src/farm/entities/farm.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Soil } from 'src/soil/entities/soil.entity';

@Entity()
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('jsonb')
  shape: {
    type: 'Polygon' | 'Multypolygon';
    coordinates: number[][][] | number[][][][];
  };

  @Column({ name: 'field_area' })
  fieldArea: number;

  @Column({ name: 'soil_id' })
  soilId: string;

  @Column({ name: 'farm_id' })
  farmId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
