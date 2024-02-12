import { Module } from '@nestjs/common';
import { CropService } from './crop.service';
import { CropController } from './crop.controller';
import { Crop } from './entities/crop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Crop])],
  controllers: [CropController],
  providers: [CropService],
  exports: [CropService],
})
export class CropModule {}
