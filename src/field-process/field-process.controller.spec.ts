import { Test, TestingModule } from '@nestjs/testing';
import { FieldProcessController } from './field-process.controller';
import { FieldProcessService } from './field-process.service';

describe('FieldProcessController', () => {
  let controller: FieldProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FieldProcessController],
      providers: [FieldProcessService],
    }).compile();

    controller = module.get<FieldProcessController>(FieldProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
