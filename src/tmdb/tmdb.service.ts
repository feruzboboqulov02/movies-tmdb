import { Injectable, Logger, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('API_KEY');
    const accessToken = this.configService.get<string>('READ_ACCESS_TOKEN');

    this.apiKey = apiKey || '';

    if (!this.apiKey || !accessToken) {
      this.logger.error('Missing API credentials');
      throw new InternalServerErrorException('TMDB API credentials not configured');
    }

    this.headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    this.logger.log('TMDB Service initialized successfully');
  }

  private createRequestConfig(params: Record<string, any> = {}): AxiosRequestConfig {
    return {
      headers: this.headers,
      params: {
        api_key: this.apiKey,
        language: 'en-US',
        ...params,
      },
    };
  }

  async getPopularMovies(page: number = 1): Promise<TmdbMovieResponse> {
    this.logger.debug(`Fetching popular movies, page: ${page}`);
    try {
      const response = await axios.get<TmdbMovieResponse>(
        `${this.apiBaseUrl}/movie/popular`,
        this.createRequestConfig({ page }),
      );
      
      this.logger.debug(`Retrieved ${response.data.results.length} popular movies`);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'fetch popular movies');
    }
  }

  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<TmdbMovieResponse> {
    if (!query || query.trim() === '') {
      throw new BadRequestException('Search query cannot be empty');
    }

    this.logger.debug(`Searching movies with query: "${query}", page: ${page}`);
    try {
      const response = await axios.get<TmdbMovieResponse>(
        `${this.apiBaseUrl}/search/movie`,
        this.createRequestConfig({ query, page }),
      );
      
      this.logger.debug(`Found ${response.data.total_results} movies matching "${query}"`);
      return response.data;
    } catch (error) {
      this.handleApiError(error, 'search movies');
    }
  }

  async getMovieById(id: string): Promise<TmdbMovieDetails | null> {
    if (!id) {
      throw new BadRequestException('Movie ID cannot be empty');
    }

    this.logger.debug(`Fetching details for movie ID: ${id}`);
    try {
      const response = await axios.get<TmdbMovieDetails>(
        `${this.apiBaseUrl}/movie/${id}`,
        this.createRequestConfig(),
      );
      
      this.logger.debug(`Retrieved details for movie: ${response.data.title}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        this.logger.warn(`Movie with ID ${id} not found`);
        return null;
      }
      this.handleApiError(error, 'get movie details');
    }
  }

  private handleApiError(error: any, operation: string): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status || 0;
      const errorData = error.response?.data;
      
      this.logger.error(
        `TMDB API error (${status}) during ${operation}: ${JSON.stringify(errorData)}`,
        error.stack,
      );
      
      if (status === 401 || status === 403) {
        throw new InternalServerErrorException(`Authentication error with TMDB API`);
      } else if (status === 404) {
        throw new NotFoundException(`Resource not found when trying to ${operation}`);
      } else if (status === 429) {
        throw new InternalServerErrorException(`TMDB API rate limit exceeded`);
      } else if (status >= 500) {
        throw new InternalServerErrorException(`TMDB API server error`);
      }
    }
    
    this.logger.error(`Unknown error during ${operation}`, error);
    throw new InternalServerErrorException(`Failed to ${operation}`);
  }
}
