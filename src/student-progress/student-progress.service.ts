import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressItemDto } from './dto/create-progress-item.dto';
import { UpdateProgressItemDto } from './dto/update-progress-item.dto';

@Injectable()
export class StudentProgressService {
  constructor(private prisma: PrismaService) {}

  async create(createProgressItemDto: CreateProgressItemDto) {
    const { studentId, ...data } = createProgressItemDto;

    // Validate that the student exists
    const studentExists = await this.prisma.student.count({
      where: { id: studentId },
    });
    if (studentExists === 0) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    return this.prisma.studentProgress.create({
      data: {
        ...data,
        studentId: studentId,
      },
    });
  }

  // Get all progress items for a specific student
  async findAllForStudent(studentId: number) {
    return this.prisma.studentProgress.findMany({
      where: { studentId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async update(
    progressId: number,
    updateProgressItemDto: UpdateProgressItemDto,
  ) {
    try {
      return await this.prisma.studentProgress.update({
        where: { id: progressId },
        data: updateProgressItemDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Progress item with ID ${progressId} not found.`,
        );
      }
      throw error;
    }
  }

  // Special method to easily increment the revision count
  async incrementRevision(progressId: number) {
    try {
      return await this.prisma.studentProgress.update({
        where: { id: progressId },
        data: {
          revisionCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Progress item with ID ${progressId} not found.`,
        );
      }
      throw error;
    }
  }

  async remove(progressId: number) {
    try {
      await this.prisma.studentProgress.delete({ where: { id: progressId } });
      return {
        message: `Successfully deleted progress item with ID ${progressId}`,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Progress item with ID ${progressId} not found.`,
        );
      }
      throw error;
    }
  }
}
