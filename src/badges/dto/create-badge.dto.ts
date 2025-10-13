import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty({ message: 'Badge name cannot be empty.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Badge description cannot be empty.' })
  description: string;
}
