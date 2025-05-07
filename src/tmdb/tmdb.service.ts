import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

export interface TmdbMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  rating: string;
  popularity: string;
}

export interface TmdbMovieResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetails extends TmdbMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  status: string;
  tagline: string;
}

@Injectable()
export class TmdbService {
  private readonly apiBaseUrl = 'https://api.themoviedb.org/3';
  private readonly logger = new Logger(TmdbService.name);
  private readonly headers: Record<string, string>;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('API_KEY');
    const accessToken = this.configService.get<string>('READ_ACCESS_TOKEN');

    if (!apiKey || !accessToken) {
      this.logger.error('Missing API credentials');
      throw new Error('TMDB API credentials not configured');
    }

    this.headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async getPopularMovies(page: number = 1): Promise<TmdbMovieResponse> {
    try {
      const response = await axios.get<TmdbMovieResponse>(
        `${this.apiBaseUrl}/movie/popular`,
        {
          headers: this.headers,
          params: {
            api_key: this.configService.get<string>('API_KEY'),
            page,
            language: 'en-US',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to fetch popular movies: ${error.message}`);
      }
      throw new Error(`Failed to fetch popular movies:`);
    }
  }

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<TmdbMovieResponse> {
    try {
      const response = await axios.get<TmdbMovieResponse>(
        `${this.apiBaseUrl}/search/movie`,
        {
          headers: this.headers,
          params: {
            api_key: this.configService.get<string>(
              '8edbdcafaf8e789f6a99a755da6d8c29',
            ),
            query,
            page,
            language: 'en-US',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to search movies: ${error.message}`);
      }
      throw new Error(`Failed to search movies: `);
    }
  }

  async getMovieById(id: string): Promise<TmdbMovieDetails> {
    try {
      const response = await axios.get<TmdbMovieDetails>(
        `${this.apiBaseUrl}/movie/${id}`,
        {
          headers: this.headers,
          params: {
            api_key: this.configService.get<string>(
              '8edbdcafaf8e789f6a99a755da6d8c29',
            ),
            language: 'en-US',
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get movie details: ${error.message}`);
      }
      throw new Error(`Failed to get movie details: `);
    }
  }
}
