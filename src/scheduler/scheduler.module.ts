import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { TmdbModule } from '../tmdb/tmdb.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [ScheduleModule.forRoot(), TmdbModule, MoviesModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
