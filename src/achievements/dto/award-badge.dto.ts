import { IsInt, IsNotEmpty } from 'class-validator';

export class AwardBadgeDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  badgeId: number;
}
