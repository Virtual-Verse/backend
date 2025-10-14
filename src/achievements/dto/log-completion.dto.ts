import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LogCompletionDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsString()
  @IsNotEmpty()
  completedItem: string; // e.g., "Quran", "Norani Qaida"
}
