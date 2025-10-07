import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignQuizDto } from './dto/assign-quiz.dto';
import { AssignResourceDto } from './dto/assign-resource.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async assignQuiz(assignQuizDto: AssignQuizDto) {
    const { studentId, quizId } = assignQuizDto;

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found.`);
    }

    const existingAssignment =
      await this.prisma.studentQuizAssignment.findUnique({
        where: {
          studentId_quizId: { studentId, quizId },
        },
      });

    if (existingAssignment) {
      throw new BadRequestException(
        `Quiz ${quizId} is already assigned to student ${studentId}.`,
      );
    }

    return this.prisma.studentQuizAssignment.create({
      data: {
        studentId,
        quizId,
      },
    });
  }

  async assignResource(assignResourceDto: AssignResourceDto) {
    const { studentId, resourceId } = assignResourceDto;

    // 1. Validate that the student and the resource exist.
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const resource = await this.prisma.libraryResource.findUnique({
      where: { id: resourceId },
    });
    if (!resource) {
      throw new NotFoundException(
        `Library Resource with ID ${resourceId} not found.`,
      );
    }

    // 2. Check if this resource is already assigned to this student.
    const existingAssignment =
      await this.prisma.studentResourceAssignment.findUnique({
        where: {
          studentId_resourceId: { studentId, resourceId },
        },
      });

    if (existingAssignment) {
      throw new BadRequestException(
        `Resource ${resourceId} is already assigned to student ${studentId}.`,
      );
    }

    // 3. Create the assignment record.
    return this.prisma.studentResourceAssignment.create({
      data: {
        studentId,
        resourceId,
      },
    });
  }
}
