import { ProcessType } from './../../process-type/entities/process-type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Machine } from 'src/machine/entities/machine.entity';
import { GrowingPeriod } from 'src/growing-period/entities/growing-period.entity';

@Entity()
export class FieldProcess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'machine_id' })
  machineId: string;

  @Column({ name: 'process_type_id' })
  processTypeId: string;

  @Column({ name: 'growing_period_id' })
  growingPeriodId: string;

  @CreateDateColumn({ name: 'p_date' })
  pDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
