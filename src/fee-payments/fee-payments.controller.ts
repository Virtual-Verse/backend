import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateFeePaymentDto } from './dto/create-fee-payment.dto';
import { FeePaymentsService } from './fee-payments.service';

@UseGuards(AuthGuard('jwt'))
@Controller('fee-payments')
export class FeePaymentsController {
  constructor(private readonly feePaymentsService: FeePaymentsService) {}

  @Post()
  create(@Body() createFeePaymentDto: CreateFeePaymentDto) {
    return this.feePaymentsService.create(createFeePaymentDto);
  }

  @Get()
  findAll(
    @Query('familyId', new ParseIntPipe({ optional: true })) familyId?: number,
  ) {
    // This allows requests like GET /fee-payments OR GET /fee-payments?familyId=1
    return this.feePaymentsService.findAll(familyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.feePaymentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.feePaymentsService.remove(id);
  }
}
