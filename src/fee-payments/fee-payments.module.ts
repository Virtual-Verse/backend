import { Module } from '@nestjs/common';
import { FeePaymentsController } from './fee-payments.controller';
import { FeePaymentsService } from './fee-payments.service';

@Module({
  controllers: [FeePaymentsController],
  providers: [FeePaymentsService]
})
export class FeePaymentsModule {}
