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
  async getMovieByTitle(@Param('title') title: string): Promise<Movie> {
    const movie = this.moviesService.getMovieByTitle(title);
    
    if (movie) {
      return movie;
    }
    
    try {
      const searchResult = await this.tmdbService.searchMovies(title, 1);
      
      if (searchResult && searchResult.results && searchResult.results.length > 0) {
        const tmdbMovie = searchResult.results[0];
        
        const movieDetails = await this.tmdbService.getMovieById(String(tmdbMovie.id));
        
        if (movieDetails) {
          const newMovie: Movie = {
            Title: movieDetails.title,
            Year: new Date(movieDetails.release_date).getFullYear().toString(),
            Rated: movieDetails.rating || 'N/A',
            Released: movieDetails.release_date,
            Runtime: movieDetails.runtime ? `${movieDetails.runtime} min` : 'N/A',
            Genre: movieDetails.genres?.map(g => g.name).join(', ') || 'N/A',
            Director: 'N/A',
            Writer: 'N/A',
            Actors: 'N/A',
            Plot: movieDetails.overview || 'N/A',
            Language: 'N/A',
            Country: 'N/A',
            Awards: 'N/A',
            Poster: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : 'N/A',
            Metascore: 'N/A',
            imdbRating: movieDetails.popularity?.toString() || 'N/A',
            imdbVotes: 'N/A',
            imdbID: String(movieDetails.id),
            Type: 'movie',
            Response: 'True',
            Images: []
          };
          
          await this.moviesService.createMovie(newMovie);
          
          return newMovie;
        }
      }
      
      throw new NotFoundException(`Movie with title '${title}' not found in local database or TMDB`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error fetching movie from TMDB: ${error.message}`);
    }
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
        throw new NotFoundException(
          `Failed to get movie details: ${error.message}`,
        );
      }
      throw new BadRequestException(`Failed to get movie details`);
    }
  }

  @Post()
  async createMovie(@Body() movie: Partial<Movie>) {
    if (!movie) {
      throw new BadRequestException('Movie data is required');
    }
    
    if (!movie.Title) {
      throw new BadRequestException('Movie title is required');
    }
    
    // Ensure all required fields have at least default values
    const completeMovie: Movie = {
      Title: movie.Title,
      Year: movie.Year || 'N/A',
      Rated: movie.Rated || 'N/A',
      Released: movie.Released || 'N/A',
      Runtime: movie.Runtime || 'N/A',
      Genre: movie.Genre || 'N/A',
      Director: movie.Director || 'N/A',
      Writer: movie.Writer || 'N/A',
      Actors: movie.Actors || 'N/A',
      Plot: movie.Plot || 'N/A',
      Language: movie.Language || 'N/A',
      Country: movie.Country || 'N/A',
      Awards: movie.Awards || 'N/A',
      Poster: movie.Poster || 'N/A',
      Metascore: movie.Metascore || 'N/A',
      imdbRating: movie.imdbRating || 'N/A',
      imdbVotes: movie.imdbVotes || 'N/A',
      imdbID: movie.imdbID || `tmdb-${Date.now()}`, // Generate a unique ID if none provided
      Type: movie.Type || 'movie',
      Response: movie.Response || 'True',
      Images: movie.Images || [],
    };
    
    try {
      const createdMovie = await this.moviesService.createMovie(completeMovie);
      return createdMovie;
    } catch (error) {
      throw new BadRequestException(`Failed to create movie: ${error.message}`);
    }
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
  patchMovieByTitle(
    @Param('title') title: string,
    @Body() movie: Partial<Movie>,
  ) {
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
