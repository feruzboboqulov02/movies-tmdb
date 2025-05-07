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
    this.logger.log('Starting daily movie update');

    try {
      const movies = this.moviesService.getAllMovies();
      this.logger.log(`Found ${movies.length} movies to update`);

      if (movies.length === 0) {
        this.logger.warn('No movies found in database to update');
        return;
      }

      let updatedCount = 0;
      let errorCount = 0;

      for (const movie of movies) {
        try {
          if (!movie.imdbID) {
            this.logger.warn(`Movie "${movie.Title}" has no imdbID, skipping update`);
            continue;
          }

          this.logger.debug(`Fetching updated data for movie: ${movie.Title} (${movie.imdbID})`);
          const updatedMovieData = await this.tmdbService.getMovieById(movie.imdbID);

          if (updatedMovieData) {
            // Update the movie with new data
            const updatedMovie = await this.moviesService.updateMovieByTitle(movie.Title, {
              ...movie,
              ...updatedMovieData,
            });

            if (updatedMovie) {
              updatedCount++;
              this.logger.debug(`Updated movie: ${movie.Title}`);
            } else {
              this.logger.warn(`Failed to update movie: ${movie.Title} - not found in database`);
              errorCount++;
            }
          } else {
            this.logger.warn(`No updated data found for movie: ${movie.Title}`);
          }
        } catch (movieError) {
          this.logger.error(`Error updating movie ${movie.Title}:`, movieError);
          errorCount++;
        }
      }

      this.logger.log(`Finished daily movie update. Updated: ${updatedCount}, Errors: ${errorCount}`);
    } catch (error) {
      this.logger.error('Error in movie update scheduler:', error);
    }
  }
}
