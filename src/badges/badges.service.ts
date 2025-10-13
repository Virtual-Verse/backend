import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class BadgesService {
  private readonly BUCKET_NAME = 'badges';
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create(createBadgeDto: CreateBadgeDto, file: Express.Multer.File) {
    const imageUrl = await this.supabaseService.uploadFile(
      file,
      this.BUCKET_NAME,
    );

    return this.prisma.badge.create({
      data: {
        ...createBadgeDto,
        imageUrl: imageUrl,
      },
    });
  }

  findAll() {
    return this.prisma.badge.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const badge = await this.prisma.badge.findUnique({ where: { id } });
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found.`);
    }
    return badge;
  }

  async update(id: number, updateBadgeDto: UpdateBadgeDto) {
    try {
      return await this.prisma.badge.update({
        where: { id },
        data: updateBadgeDto,
      });
    } catch (error) {
      // Prisma error code for a record not found during an update/delete operation
      if (error.code === 'P2025') {
        throw new NotFoundException(`Badge with ID ${id} not found.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.badge.delete({ where: { id } });
      return { message: `Successfully deleted badge with ID ${id}` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Badge with ID ${id} not found.`);
      }
      throw error;
    }
  }
}
