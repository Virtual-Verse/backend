import { Test, TestingModule } from '@nestjs/testing';
import { FeePaymentsController } from './fee-payments.controller';

describe('FeePaymentsController', () => {
  let controller: FeePaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeePaymentsController],
    }).compile();

    controller = module.get<FeePaymentsController>(FeePaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
