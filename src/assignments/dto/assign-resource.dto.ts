// src/assignments/dto/assign-resource.dto.ts
import { IsInt, IsNotEmpty } from 'class-validator';

export class AssignResourceDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  resourceId: number;
}
