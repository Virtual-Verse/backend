import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentStatusDto } from './dto/update-student-status.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const { familyId, enrolledAt, ...studentData } = createStudentDto;

    const familyExists = await this.prisma.family.count({
      where: { id: familyId },
    });
    if (familyExists === 0) {
      throw new NotFoundException(
        `Family with ID ${familyId} not found. Cannot create student.`,
      );
    }

    const dataToCreate: any = {
      ...studentData,
      family: {
        connect: { id: familyId },
      },
    };

    if (enrolledAt) {
      dataToCreate.enrolledAt = new Date(enrolledAt);
    }

    return this.prisma.student.create({
      data: dataToCreate,
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        enrolledAt: true,
        family: { select: { familyName: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        family: { select: { familyName: true, id: true } },
        progressItems: true, // Show all progress tracking items
        completionRecords: true, // Show all completion records
        quizAssignments: true,
        resourceAssignments: true,
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    try {
      return await this.prisma.student.update({
        where: { id },
        data: updateStudentDto,
      });
    } catch (error) {
      // Handle the case where the student ID might not exist
      if (error.code === 'P2025') {
        throw new NotFoundException(`Student with ID ${id} not found.`);
      }
      throw error;
    }
  }

  async updateStatus(
    id: number,
    updateStudentStatusDto: UpdateStudentStatusDto,
  ) {
    // Check if the student exists first
    const studentExists = await this.prisma.student.count({ where: { id } });
    if (studentExists === 0) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        status: updateStudentStatusDto.status,
      },
    });
  }
}
