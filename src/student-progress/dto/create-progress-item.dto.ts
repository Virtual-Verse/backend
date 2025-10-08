import { ProgressStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProgressItemDto {
  @IsString()
  @IsNotEmpty()
  category: string; // e.g., "Dua", "Hadith", "Quran Para"

  @IsString()
  @IsNotEmpty()
  title: string; // e.g., "Ayatul Kursi", "Hadith #1", "Para 30"

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(ProgressStatus)
  @IsOptional()
  status?: ProgressStatus;

  @IsInt()
  @IsNotEmpty()
  studentId: number;
}
