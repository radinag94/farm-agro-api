import { Module, forwardRef } from '@nestjs/common';
import { FieldProcessService } from './field-process.service';
import { FieldProcessController } from './field-process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldProcess } from './entities/field-process.entity';
import { MachineModule } from 'src/machine/machine.module';
import { ProcessTypeModule } from 'src/process-type/process-type.module';
import { GrowingPeriodModule } from 'src/growing-period/growing-period.module';
import { MachineService } from 'src/machine/machine.service';
import { ProcessTypeService } from 'src/process-type/process-type.service';
import { GrowingPeriodService } from 'src/growing-period/growing-period.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldProcess]),
    // ProcessTypeModule,
    // GrowingPeriodModule,
    // forwardRef(() => MachineModule),
  ],
  controllers: [FieldProcessController],
  providers: [
    FieldProcessService,
    // MachineService,
    // ProcessTypeService,
    // GrowingPeriodService,
  ],
  exports: [
    FieldProcessService,
    // MachineService,
    // ProcessTypeService,
    // GrowingPeriodService,
  ],
})
export class FieldProcessModule {}
