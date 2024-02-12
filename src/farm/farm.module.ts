import { Module, forwardRef } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { Farm } from './entities/farm.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineModule } from 'src/machine/machine.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), forwardRef(() => MachineModule)],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
