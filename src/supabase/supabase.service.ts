// src/supabase/supabase.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Express } from 'express'; // This is for Multer type, keep it.

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceKey = this.configService.get<string>(
      'SUPABASE_SERVICE_KEY',
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Key must be provided in .env');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    folder?: string,
  ): Promise<string> {
    const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;

    const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    if (!urlData) {
      throw new Error('Could not get public URL for the uploaded file.');
    }

    return urlData.publicUrl;
  }

  // --- NEW IMPLEMENTATION FOR deleteFile ---
  async deleteFile(bucketName: string, filePathInStorage: string): Promise<void> {
    // Supabase storage's remove method expects an array of file paths relative to the bucket.
    // Ensure filePathInStorage is just the path within the bucket (e.g., 'folder/filename.pdf')
    const { error } = await this.supabase.storage
      .from(bucketName)
      .remove([filePathInStorage]); // Pass an array containing the single path

    if (error) {
      throw new Error(`Supabase delete error for file ${filePathInStorage}: ${error.message}`);
    }
    console.log(`File ${filePathInStorage} successfully deleted from Supabase bucket ${bucketName}.`);
  }

  // --- NEW IMPLEMENTATION FOR getPublicUrlPrefix ---
  // This method constructs the base public URL path that precedes the file's path within the bucket.
  getPublicUrlPrefix(bucketName: string): string {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    // Example: https://<project-ref>.supabase.co/storage/v1/object/public/
    // The bucket name is usually *after* '/public/' in the URL structure.
    // So, the prefix should be: <SUPABASE_URL>/storage/v1/object/public/<BUCKET_NAME>/
    //
    // However, the `getPublicUrl` method in your `uploadFile` already gives us the full public URL.
    // The `remove` logic in `LibraryResourcesService` aims to *extract* the `filePathInStorage`
    // from the `fileUrl`.
    //
    // Let's refine the prefix logic based on the `getPublicUrl`'s output:
    // `urlData.publicUrl` looks like `https://<PROJECT_REF>.supabase.co/storage/v1/object/public/BUCKET_NAME/folder/file.ext`
    // We need everything *before* 'folder/file.ext' which includes the bucket name.
    //
    // A more robust way:
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/`;
  }
}