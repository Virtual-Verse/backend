import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignQuizDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  quizId: number;
}
