import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { FamiliesService } from './families.service';

// REMOVED @UseGuards from the class level to allow public routes
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) { }

  // --- PUBLIC ROUTES (No Auth Guard) ---

  @Get('public/:loginLinkId') // GET /families/public/cmg...
  getPublicFamilyInfo(@Param('loginLinkId') loginLinkId: string) {
    // We pass the URL param to the service
    return this.familiesService.findByLoginLinkId(loginLinkId);
  }

  @Post('login') // POST /families/login
  loginFamily(@Body() body: { id: number; password: string }) {
    return this.familiesService.verifyFamilyPassword(body.id, body.password);
  }

  // --- ADMIN ROUTES (Protected) ---

  @Post()
  @UseGuards(AuthGuard('jwt')) // Protected
  create(@Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(createFamilyDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt')) // Protected
  findAll() {
    return this.familiesService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt')) // Protected
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) // Protected
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familiesService.update(id, updateFamilyDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // Protected
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.familiesService.remove(id);
  }
}