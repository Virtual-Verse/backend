import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AchievementsService } from './achievements.service';
import { AwardBadgeDto } from './dto/award-badge.dto';
import { LogCompletionDto } from './dto/log-completion.dto';

@UseGuards(AuthGuard('jwt')) // Protect all achievement routes
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post('award-badge') // POST /achievements/award-badge
  awardBadge(@Body() awardBadgeDto: AwardBadgeDto) {
    return this.achievementsService.awardBadge(awardBadgeDto);
  }

  @Post('log-completion') // POST /achievements/log-completion
  logCompletion(@Body() logCompletionDto: LogCompletionDto) {
    return this.achievementsService.logCompletion(logCompletionDto);
  }
}
