import { dataSourceOptions } from './../db/data.source';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './user/user.module';
import { FieldProcessModule } from './field-process/field-process.module';
import { ProcessTypeModule } from './process-type/process-type.module';
import { CropModule } from './crop/crop.module';
import { GrowingPeriodModule } from './growing-period/growing-period.module';
import { MachineModule } from './machine/machine.module';
import { SoilModule } from './soil/soil.module';
import { FieldModule } from './field/field.module';
import { FarmModule } from './farm/farm.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    FarmModule,
    FieldModule,
    SoilModule,
    MachineModule,
    GrowingPeriodModule,
    CropModule,
    ProcessTypeModule,
    FieldProcessModule,
    ReportsModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
