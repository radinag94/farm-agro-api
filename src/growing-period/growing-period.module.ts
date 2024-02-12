import { FieldProcessService } from 'src/field-process/field-process.service';
import { ProcessTypeService } from './../process-type/process-type.service';
import { MachineService } from 'src/machine/machine.service';
import { FieldService } from 'src/field/field.service';
import { Module } from '@nestjs/common';
import { GrowingPeriodService } from './growing-period.service';
import { GrowingPeriodController } from './growing-period.controller';
import { GrowingPeriod } from './entities/growing-period.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropModule } from 'src/crop/crop.module';
import { FieldModule } from 'src/field/field.module';
import { CropService } from 'src/crop/crop.service';
import { ProcessTypeModule } from 'src/process-type/process-type.module';
import { MachineModule } from 'src/machine/machine.module';
import { FieldProcessModule } from 'src/field-process/field-process.module';

@Module({
  imports: [
    CropModule,
    FieldModule,
    ProcessTypeModule,
    MachineModule,
    FieldProcessModule,
    TypeOrmModule.forFeature([GrowingPeriod]),
  ],
  controllers: [GrowingPeriodController],
  providers: [GrowingPeriodService],
  exports: [GrowingPeriodService],
})
export class GrowingPeriodModule {}
