import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';
import { AssignQuizDto } from './dto/assign-quiz.dto';
import { AssignResourceDto } from './dto/assign-resource.dto';

@UseGuards(AuthGuard('jwt')) // Protect all assignment routes
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post('quizzes') // POST /assignments/quizzes
  assignQuiz(@Body() assignQuizDto: AssignQuizDto) {
    return this.assignmentsService.assignQuiz(assignQuizDto);
  }

  @Post('resources') // POST /assignments/resources
  assignResource(@Body() assignResourceDto: AssignResourceDto) {
    return this.assignmentsService.assignResource(assignResourceDto);
  }
}
