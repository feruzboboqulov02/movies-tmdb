import { Injectable } from '@nestjs/common';
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

  constructor() {
    this.loadMovies();
  }

  private async loadMovies() {
    try {
      const dbData = await fs.promises.readFile(this.dbPath, 'utf-8');
      this.movies = JSON.parse(dbData) as Movie[];
    } catch (error) {
      console.error('Error loading movies from database:', error);
      this.movies = [];
    }
  }

  private async saveMovies() {
    try {
      await fs.promises.writeFile(this.dbPath, JSON.stringify(this.movies));
    } catch (error) {
      console.error('Error saving movies to database:', error);
    }
  }

  getAllMovies() {
    return this.movies;
  }

  createMovie(movie: Movie) {
    const newMovie = {
      ...movie,
      Title: movie.Title,
      id: this.movies.length + 1,
    };
    this.movies.push(newMovie);
    this.saveMovies();
    return;
  }

  getMovieByTitle(title: string) {
    console.log('getMovieByTitle - > List of moviess', {
      movies: this.movies,
      title,
    });

    return this.movies.find((movie) => movie.Title === title);
  }

  deleteMovieByTitle(title: string) {
    const name = this.movies.find((movie) => movie.Title === title);
    if (!name) {
      return {
        message: 'movie not found',
      };
    }
    const deletedMovie = this.movies.indexOf(name);
    this.saveMovies();
    this.movies.splice(deletedMovie, 1);
    return {
      message: { 'movie deleted successfully': deletedMovie },
    };
  }

  updateMovieByTitle(title: string, movie: Movie) {
    const name = this.movies.find((movie) => movie.Title === title);
    if (!name) {
      return {
        message: 'movie not found',
      };
    }
    const updatedMovie = this.movies.indexOf(name);
    this.movies[updatedMovie] = movie;
    this.saveMovies();
    return {
      message: { 'movie updated successfully': updatedMovie },
    };
  }

  patchMovieByTitle(title: string, movie: Partial<Movie>) {
    const name = this.movies.find((movie) => movie.Title === title);
    if (!name) {
      return {
        message: 'movie not found',
      };
    }
    const patchedMovie = this.movies.indexOf(name);
    this.movies[patchedMovie] = { ...this.movies[patchedMovie], ...movie };
    this.saveMovies();
    return {
      message: { 'movie patched successfully': patchedMovie },
    };
  }
}
