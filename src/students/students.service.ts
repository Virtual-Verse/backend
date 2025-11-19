import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStudentStatusDto } from './dto/update-student-status.dto';

// --- A NEW HELPER FUNCTION ---
const transformStudentData = (dto: CreateStudentDto | UpdateStudentDto) => {
  // --- THE FIX IS HERE ---
  // We add 'familyId' to this list.
  // This extracts it from 'dto', so it is NOT included in 'restData'.
  const { age, tuitionFee, enrolledAt, familyId, ...restData } = dto as any; 
  
  const data: any = { ...restData };

  // 1. Handle Age (Number)
  if (age !== undefined) {
    data.age = age === null || age === '' ? null : Number(age);
  }

  // 2. Handle Tuition Fee (Decimal)
  if (tuitionFee !== undefined) {
    data.tuitionFee =
      tuitionFee === null || tuitionFee === '' ? null : new Prisma.Decimal(tuitionFee);
  }

  // 3. Handle EnrolledAt (Date)
  if (enrolledAt) {
    data.enrolledAt = new Date(enrolledAt);
  } else if (enrolledAt === '' || enrolledAt === null) {
    data.enrolledAt = null;
  }
  
  return data;
};

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const { familyId } = createStudentDto; // We still need familyId here for the check

    // 1. Check Family Existence
    const familyExists = await this.prisma.family.count({ where: { id: familyId } });
    if (familyExists === 0) {
      throw new NotFoundException(`Family with ID ${familyId} not found.`);
    }

    // 2. Transform Data
    // The transformer now ensures 'familyId' is REMOVED from dataToCreate
    const dataToCreate = transformStudentData(createStudentDto);

    // 3. Create Student
    return this.prisma.student.create({
      data: {
        ...dataToCreate, // Safe to spread now
        family: {
          connect: { id: familyId },
        },
      },
    });
  }


  // This method returns all students with their family information.
  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { id: 'asc' },
      include: {
        family: {
          select: {
            familyName: true,
          },
        },
      },
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
      const dataToUpdate = transformStudentData(updateStudentDto);
      
      return await this.prisma.student.update({
        where: { id },
        data: dataToUpdate,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
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
