import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProgressItemDto } from './dto/create-progress-item.dto';
import { UpdateProgressItemDto } from './dto/update-progress-item.dto';
import { StudentProgressService } from './student-progress.service';

@UseGuards(AuthGuard('jwt'))
@Controller('student-progress')
export class StudentProgressController {
  constructor(
    private readonly studentProgressService: StudentProgressService,
  ) {}

  @Post()
  create(@Body() createProgressItemDto: CreateProgressItemDto) {
    return this.studentProgressService.create(createProgressItemDto);
  }

  @Get('student/:studentId')
  findAllForStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.studentProgressService.findAllForStudent(studentId);
  }

  @Patch(':progressId')
  update(
    @Param('progressId', ParseIntPipe) progressId: number,
    @Body() updateProgressItemDto: UpdateProgressItemDto,
  ) {
    return this.studentProgressService.update(
      progressId,
      updateProgressItemDto,
    );
  }

  @Post(':progressId/increment-revision') // A nice, clean route for this action
  incrementRevision(@Param('progressId', ParseIntPipe) progressId: number) {
    return this.studentProgressService.incrementRevision(progressId);
  }

  @Delete(':progressId')
  remove(@Param('progressId', ParseIntPipe) progressId: number) {
    return this.studentProgressService.remove(progressId);
  }
}
