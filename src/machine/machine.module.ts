import { FieldProcessService } from './../field-process/field-process.service';
import { FieldProcessModule } from 'src/field-process/field-process.module';
import { Module } from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineController } from './machine.controller';
import { Machine } from './entities/machine.entity';
import { FarmModule } from 'src/farm/farm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { FieldService } from 'src/field/field.service';
import { FieldProcess } from 'src/field-process/entities/field-process.entity';
import { ProcessTypeService } from 'src/process-type/process-type.service';
import { GrowingPeriodService } from 'src/growing-period/growing-period.service';
import { SoilService } from 'src/soil/soil.service';
import { ProcessType } from 'src/process-type/entities/process-type.entity';
import { GrowingPeriod } from 'src/growing-period/entities/growing-period.entity';
import { CropService } from 'src/crop/crop.service';
import { Soil } from 'src/soil/entities/soil.entity';
import { Crop } from 'src/crop/entities/crop.entity';
import { FieldModule } from 'src/field/field.module';
import { FarmService } from 'src/farm/farm.service';
import { Farm } from 'src/farm/entities/farm.entity';

@Module({
  imports: [
    forwardRef(() => FarmModule),
    TypeOrmModule.forFeature([Machine]),
    forwardRef(() => FieldProcessModule),
  ],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachineModule {}
