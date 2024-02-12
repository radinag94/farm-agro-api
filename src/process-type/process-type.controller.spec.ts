import { Test, TestingModule } from '@nestjs/testing';
import { ProcessTypeController } from './process-type.controller';
import { ProcessTypeService } from './process-type.service';

describe('ProcessTypeController', () => {
  let controller: ProcessTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessTypeController],
      providers: [ProcessTypeService],
    }).compile();

    controller = module.get<ProcessTypeController>(ProcessTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
