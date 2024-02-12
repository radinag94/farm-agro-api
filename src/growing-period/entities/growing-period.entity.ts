import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { Crop } from 'src/crop/entities/crop.entity';
import { Field } from 'src/field/entities/field.entity';

@Entity()
export class GrowingPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'crop_id' })
  cropId: string;

  @Column({ name: 'field_id' })
  fieldId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
