// src/library-resources/library-resources.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLibraryResourceDto } from './dto/create-library-resource.dto';
import { UpdateLibraryResourceDto } from './dto/update-library-resource.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LibraryResourcesService {
  private readonly BUCKET_NAME = 'library-resources'; // Your Supabase bucket name

  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  async create(
    createLibraryResourceDto: CreateLibraryResourceDto,
    file: Express.Multer.File,
  ) {
    const folderName = createLibraryResourceDto.category
      .toLowerCase()
      .replace(/\s+/g, '-');

    const fileUrl = await this.supabaseService.uploadFile(
      file,
      this.BUCKET_NAME,
      folderName,
    );

    return this.prisma.libraryResource.create({
      data: {
        ...createLibraryResourceDto,
        fileUrl: fileUrl,
      },
    });
  }

  findAll() {
    return this.prisma.libraryResource.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const resource = await this.prisma.libraryResource.findUnique({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found.`);
    }
    return resource;
  }

  async update(id: number, updateLibraryResourceDto: UpdateLibraryResourceDto) {
    // IMPORTANT: If updateDto can include a new file, this method would need
    // to handle deleting the old file from storage and uploading the new one.
    // For now, assuming update is text-only.
    try {
      return await this.prisma.libraryResource.update({
        where: { id },
        data: updateLibraryResourceDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Resource with ID ${id} not found.`);
      }
      throw error;
    }
  }

  // --- MODIFIED REMOVE METHOD ---
  async remove(id: number) {
    // 1. Find the resource to get its fileUrl BEFORE deleting from DB
    const resource = await this.prisma.libraryResource.findUnique({
      where: { id },
      select: { fileUrl: true }, // Only select fileUrl to minimize data transfer
    });

    if (!resource) {
      throw new NotFoundException(`Library resource with ID ${id} not found.`);
    }

    // 2. Extract the file path from the fileUrl
    // This assumes your fileUrl is something like:
    // https://<project-ref>.supabase.co/storage/v1/object/public/BUCKET_NAME/folder/filename.ext
    // We need to extract 'BUCKET_NAME/folder/filename.ext'
    const fullPathInStorage = resource.fileUrl.split(this.supabaseService.getPublicUrlPrefix(this.BUCKET_NAME))[1];

    if (!fullPathInStorage) {
      // This is a safety check; should ideally not happen if fileUrl is well-formed
      console.warn(`Could not extract full path from fileUrl: ${resource.fileUrl}. Proceeding with DB deletion only.`);
    } else {
      // 3. Delete the file from Supabase Storage
      try {
        await this.supabaseService.deleteFile(this.BUCKET_NAME, fullPathInStorage);
        console.log(`File ${fullPathInStorage} deleted from Supabase Storage.`);
      } catch (storageError) {
        console.error(`Failed to delete file ${fullPathInStorage} from Supabase Storage:`, storageError);
        // DECISION POINT: What to do if storage deletion fails?
        // Option A (Recommended for atomicity): Re-throw error to prevent DB deletion too.
        //   throw new Error('Failed to delete resource and its file. Please try again.');
        // Option B: Log and proceed with DB deletion anyway (less critical files).
        // For professional apps, atomicity (both succeed or both fail) is often preferred.
        // For now, we'll log and proceed with DB deletion, but keep this in mind.
      }
    }

    // 4. Delete the resource from the database
    // This will only happen if finding the resource succeeded and we've attempted storage deletion.
    return this.prisma.libraryResource.delete({ where: { id } });
  }
}