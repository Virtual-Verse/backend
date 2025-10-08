import { ProgressStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProgressItemDto {
  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(ProgressStatus)
  @IsOptional()
  status?: ProgressStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  revisionCount?: number;
}
