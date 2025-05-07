import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  Response: string;
  Images: string[];
}
@Injectable()
export class MoviesService {
  private movies: Movie[] = [];
  private readonly dbPath: string = path.join(process.cwd(), 'db.json');
  private readonly logger = new Logger(MoviesService.name);

  constructor() {
    this.loadMovies();
  }

  private async loadMovies() {
    try {
      const dbData = await fs.promises.readFile(this.dbPath, 'utf-8');
      this.movies = JSON.parse(dbData) as Movie[];
      this.logger.log(`Loaded ${this.movies.length} movies from database`);
    } catch (error) {
      this.logger.error('Error loading movies from database:', error);
      // If file doesn't exist, create an empty database
      if (error.code === 'ENOENT') {
        await this.saveMovies();
        this.logger.log('Created new empty database file');
      }
      this.movies = [];
    }
  }

  private async saveMovies() {
    try {
      await fs.promises.writeFile(this.dbPath, JSON.stringify(this.movies, null, 2));
      this.logger.log(`Saved ${this.movies.length} movies to database`);
      return true;
    } catch (error) {
      this.logger.error('Error saving movies to database:', error);
      return false;
    }
  }

  getAllMovies(): Movie[] {
    return this.movies;
  }

  async createMovie(movie: Movie): Promise<Movie> {
    try {
      if (!movie) {
        throw new Error('Movie object is required');
      }
      
      if (!movie.Title) {
        throw new Error('Movie title is required');
      }
      
      // Check if movie with this title already exists
      const existingMovie = this.movies.find(m => m.Title === movie.Title);
      if (existingMovie) {
        this.logger.warn(`Movie with title '${movie.Title}' already exists, returning existing movie`);
        return existingMovie;
      }
      
      // Create a new movie object with the provided data
      const newMovie: Movie = {
        ...movie,
        // Ensure Title is set
        Title: movie.Title,
      };
      
      this.movies.push(newMovie);
      await this.saveMovies();
      
      this.logger.log(`Created new movie: ${newMovie.Title}`);
      return newMovie;
    } catch (error) {
      this.logger.error(`Error creating movie: ${error.message}`);
      throw error;
    }
  }

  getMovieByTitle(title: string): Movie | undefined {
    this.logger.debug(`Searching for movie with title: ${title}`);
    return this.movies.find((movie) => movie.Title === title);
  }

  async deleteMovieByTitle(title: string): Promise<boolean> {
    const movie = this.movies.find((movie) => movie.Title === title);
    if (!movie) {
      return false;
    }
    
    const index = this.movies.indexOf(movie);
    this.movies.splice(index, 1);
    await this.saveMovies();
    
    return true;
  }

  async updateMovieByTitle(title: string, movie: Movie): Promise<Movie | null> {
    const existingMovie = this.movies.find((m) => m.Title === title);
    if (!existingMovie) {
      return null;
    }
    
    const index = this.movies.indexOf(existingMovie);
    this.movies[index] = {
      ...movie,
      // Preserve the original title to maintain identity
      Title: title,
    };
    
    await this.saveMovies();
    return this.movies[index];
  }

  async patchMovieByTitle(title: string, movie: Partial<Movie>): Promise<Movie | null> {
    const existingMovie = this.movies.find((m) => m.Title === title);
    if (!existingMovie) {
      return null;
    }
    
    const index = this.movies.indexOf(existingMovie);
    this.movies[index] = { 
      ...this.movies[index], 
      ...movie,
      // Preserve the original title to maintain identity
      Title: title,
    };
    
    await this.saveMovies();
    return this.movies[index];
  }
}
