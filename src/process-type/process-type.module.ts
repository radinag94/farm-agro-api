import { Module } from '@nestjs/common';
import { ProcessTypeService } from './process-type.service';
import { ProcessTypeController } from './process-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessType } from './entities/process-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessType])],
  controllers: [ProcessTypeController],
  providers: [ProcessTypeService],
  exports: [ProcessTypeService],
})
export class ProcessTypeModule {}
