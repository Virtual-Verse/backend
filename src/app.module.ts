import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FamiliesModule } from './families/families.module';
import { StudentsModule } from './students/students.module';
import { LibraryResourcesModule } from './library-resources/library-resources.module';
import { SupabaseModule } from './supabase/supabase.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { StudentProgressModule } from './student-progress/student-progress.module';
import { BadgesModule } from './badges/badges.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    FamiliesModule,
    StudentsModule,
    LibraryResourcesModule,
    SupabaseModule,
    QuizzesModule,
    AssignmentsModule,
    StudentProgressModule,
    BadgesModule,
    AchievementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
