import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TmdbService } from '../tmdb/tmdb.service';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly tmdbService: TmdbService,
    private readonly moviesService: MoviesService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Starting daily movie update');

    try {
      const movies = this.moviesService.getAllMovies();

      for (const movie of movies) {
        const updatedMovieData = await this.tmdbService.getMovieById(
          movie.imdbID,
        );

        if (updatedMovieData) {
          // Update the movie with new data
          this.moviesService.updateMovieByTitle(movie.Title, {
            ...movie,
            ...updatedMovieData,
          });
          this.logger.debug(`Updated movie: ${movie.Title}`);
        }
      }

      this.logger.debug('Finished daily movie update');
    } catch (error) {
      this.logger.error('Error updating movies:', error);
    }
  }
}
