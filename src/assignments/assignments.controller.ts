import { Body, Controller, Get, ParseIntPipe, Post, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { AssignQuizDto } from './dto/assign-quiz.dto';
import { AssignResourceDto } from './dto/assign-resource.dto';

@UseGuards(AuthGuard('jwt')) // Protect all assignment routes
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }

  @Post('quizzes') // POST /assignments/quizzes
  assignQuiz(@Body() assignQuizDto: AssignQuizDto) {
    return this.assignmentsService.assignQuiz(assignQuizDto);
  }

  @Post('resources') // POST /assignments/resources
  assignResource(@Body() assignResourceDto: AssignResourceDto) {
    return this.assignmentsService.assignResource(assignResourceDto);
  }

  @Get('quizzes') // GET /assignments/quizzes
  findAllQuizAssignments() {
    return this.assignmentsService.findAllQuizAssignments();
  }

  @Get('resources') // GET /assignments/resources
  findAllResourceAssignments() {
    return this.assignmentsService.findAllResourceAssignments();
  }

  @Get('student/:studentId/quizzes')
  findStudentQuizAssignments(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.assignmentsService.findStudentQuizAssignments(studentId);
  }

  // Ideally, add @Public() here
  @Get('student/:studentId/resources')
  findStudentResourceAssignments(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.assignmentsService.findStudentResourceAssignments(studentId);
  }
}
