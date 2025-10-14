import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AwardBadgeDto } from './dto/award-badge.dto';
import { LogCompletionDto } from './dto/log-completion.dto';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async awardBadge(awardBadgeDto: AwardBadgeDto) {
    const { studentId, badgeId } = awardBadgeDto;

    // 1. Validate that both the student and the badge template exist.
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const badge = await this.prisma.badge.findUnique({
      where: { id: badgeId },
    });
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${badgeId} not found.`);
    }

    // 2. Create the StudentBadge record. Prisma will automatically throw an error
    // if the student has already been awarded this badge, thanks to the @@unique constraint.
    try {
      return await this.prisma.studentBadge.create({
        data: {
          studentId,
          badgeId,
        },
      });
    } catch (error) {
      // Prisma's unique constraint violation error code
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `Student ${studentId} has already been awarded badge ${badgeId}.`,
        );
      }
      throw error;
    }
  }

  async logCompletion(logCompletionDto: LogCompletionDto) {
    const { studentId, completedItem } = logCompletionDto;

    // 1. Validate that the student exists.
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    // 2. Create the completion record.
    return this.prisma.completionRecord.create({
      data: {
        studentId,
        completedItem,
      },
    });
  }
}
