import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ConfigModule } from '@nestjs/config';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { TmdbModule } from 'src/tmdb/tmdb.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, TmdbService],
  imports: [ConfigModule, TmdbModule],
  exports: [MoviesService],
})
export class MoviesModule {}
