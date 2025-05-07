import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { TmdbMovieResponse, TmdbMovieDetails } from 'src/tmdb/tmdb.service';

import { Movie, MoviesService } from './movies.service';
import { NotFoundError } from 'rxjs';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly moviesService: MoviesService,
  ) {}

  @Get('popular')
  async getPopularMovies(
    @Query('page') page: number = 1,
  ): Promise<TmdbMovieResponse> {
    return await this.tmdbService.getPopularMovies(page);
  }

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page: number = 1,
  ): Promise<TmdbMovieResponse> {
    return await this.tmdbService.searchMovies(query, page);
  }

  @Get(':title')
  getMoviByTitle(@Param('title') title: string): Movie | undefined {
    console.log('GetMovieByTitle -> title', title);

    return this.moviesService.getMovieByTitle(title);
  }

  @Get(':id')
  async getMovieDetails(@Param('id') id: string): Promise<TmdbMovieDetails> {
    try {
      const movieDetails = await this.tmdbService.getMovieById(id);
      if (!movieDetails) {
        throw new Error('Movie not found');
      }
      return movieDetails;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new Error(`Failed to get movie details: ${error.message}`);
      }
      throw new Error(`Failed to get movie details: `);
    }
  }

  @Post()
  createMovie(@Body() movie: Movie) {
    return this.moviesService.createMovie(movie);
  }

  @Put(':title')
  updateMovieByTitle(@Body() title: string, @Body() movie: Movie) {
    return this.moviesService.updateMovieByTitle(title, movie);
  }

  @Patch(':title')
  patchMovieByTitle(@Body() title: string, @Body() movie: Partial<Movie>) {
    return this.moviesService.patchMovieByTitle(title, movie);
  }

  @Delete(':title')
  deleteMovieByTitle(@Body() title: string) {
    return this.moviesService.deleteMovieByTitle(title);
  }
}
