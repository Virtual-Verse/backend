import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateFeePaymentDto {
  @IsInt()
  @Min(2020, { message: 'Year must be 2020 or later.' })
  @Max(2099, { message: 'Year must be 2099 or earlier.' })
  @IsNotEmpty()
  year: number;

  @IsInt()
  @Min(1, { message: 'Month must be between 1 and 12.' })
  @Max(12, { message: 'Month must be between 1 and 12.' })
  @IsNotEmpty()
  month: number;

  @IsInt()
  @IsNotEmpty()
  familyId: number;
}
