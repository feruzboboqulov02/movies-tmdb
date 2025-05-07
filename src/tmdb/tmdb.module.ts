import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
