import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard('jwt')) // Protects all routes in this controller
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createBadgeDto: CreateBadgeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.badgesService.create(createBadgeDto, file);
  }

  @Get()
  findAll() {
    return this.badgesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBadgeDto: UpdateBadgeDto,
  ) {
    return this.badgesService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.badgesService.remove(id);
  }
}
