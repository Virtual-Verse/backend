// src/students/dto/update-student.dto.ts
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @IsOptional() // Name can still be optional if you only want to update age, etc.
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  age?: number; // Always accept as a string

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  tuitionFee?: string; // Always accept as a string

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  enrolledAt?: string;
}
