import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { MachineModule } from 'src/machine/machine.module';
import { FarmModule } from 'src/farm/farm.module';
import { FieldModule } from 'src/field/field.module';
import { SoilModule } from 'src/soil/soil.module';
import { CropModule } from 'src/crop/crop.module';
import { GrowingPeriodModule } from 'src/growing-period/growing-period.module';

@Module({
  imports: [
    MachineModule,
    FarmModule,
    FieldModule,
    SoilModule,
    CropModule,
    GrowingPeriodModule,
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
