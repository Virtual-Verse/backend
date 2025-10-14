import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeePaymentDto } from './dto/create-fee-payment.dto';

@Injectable()
export class FeePaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(createFeePaymentDto: CreateFeePaymentDto) {
    const { familyId, year, month } = createFeePaymentDto;

    // 1. Validate that the Family exists
    const family = await this.prisma.family.findUnique({
      where: { id: familyId },
    });
    if (!family) {
      throw new NotFoundException(`Family with ID ${familyId} not found.`);
    }

    // 2. Attempt to create the payment record. Prisma's @@unique constraint
    // on [familyId, year, month] will prevent duplicates automatically.
    try {
      return await this.prisma.feePayment.create({
        data: {
          familyId,
          year,
          month,
        },
      });
    } catch (error) {
      // Prisma's unique constraint violation error code
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `A payment record for family ${familyId} for month ${month}/${year} already exists.`,
        );
      }
      throw error;
    }
  }

  // Find all payments, optionally filtered by family
  async findAll(familyId?: number) {
    return this.prisma.feePayment.findMany({
      where: {
        familyId: familyId ? familyId : undefined,
      },
      include: {
        family: {
          select: {
            familyName: true,
          },
        },
      },
      orderBy: {
        paidAt: 'desc',
      },
    });
  }

  // Find a single payment record by its own ID
  async findOne(id: number) {
    const payment = await this.prisma.feePayment.findUnique({
      where: { id },
      include: { family: { select: { familyName: true } } },
    });
    if (!payment) {
      throw new NotFoundException(`Fee payment with ID ${id} not found.`);
    }
    return payment;
  }

  // Delete a payment record if it was made in error
  async remove(id: number) {
    try {
      await this.prisma.feePayment.delete({ where: { id } });
      return { message: `Successfully deleted fee payment with ID ${id}` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Fee payment with ID ${id} not found.`);
      }
      throw error;
    }
  }
}
