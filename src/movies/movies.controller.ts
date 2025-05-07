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
  NotFoundException,
  BadRequestException,
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

  @Get('title/:title')
  getMovieByTitle(@Param('title') title: string): Movie | undefined {
    const movie = this.moviesService.getMovieByTitle(title);
    if (!movie) {
      throw new NotFoundException(`Movie with title '${title}' not found`);
    }
    return movie;
  }

  @Get('id/:id')
  async getMovieDetails(@Param('id') id: string): Promise<TmdbMovieDetails> {
    try {
      const movieDetails = await this.tmdbService.getMovieById(id);
      if (!movieDetails) {
        throw new NotFoundException(`Movie with ID '${id}' not found`);
      }
      return movieDetails;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(`Failed to get movie details: ${error.message}`);
      }
      throw new BadRequestException(`Failed to get movie details`);
    }
  }

  @Post()
  createMovie(@Body() movie: Movie) {
    return this.moviesService.createMovie(movie);
  }

  @Put(':title')
  updateMovieByTitle(@Param('title') title: string, @Body() movie: Movie) {
    const updatedMovie = this.moviesService.updateMovieByTitle(title, movie);
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with title '${title}' not found`);
    }
    return updatedMovie;
  }

  @Patch(':title')
  patchMovieByTitle(@Param('title') title: string, @Body() movie: Partial<Movie>) {
    const updatedMovie = this.moviesService.patchMovieByTitle(title, movie);
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with title '${title}' not found`);
    }
    return updatedMovie;
  }

  @Delete(':title')
  deleteMovieByTitle(@Param('title') title: string) {
    const deleted = this.moviesService.deleteMovieByTitle(title);
    if (!deleted) {
      throw new NotFoundException(`Movie with title '${title}' not found`);
    }
    return { message: `Movie with title '${title}' successfully deleted` };
  }
}
