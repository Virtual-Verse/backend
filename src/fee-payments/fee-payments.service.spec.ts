import { Test, TestingModule } from '@nestjs/testing';
import { FeePaymentsService } from './fee-payments.service';

describe('FeePaymentsService', () => {
  let service: FeePaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeePaymentsService],
    }).compile();

    service = module.get<FeePaymentsService>(FeePaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
