<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" width="200" alt="TMDB Logo" />
</p>

<h1 align="center">Movie Database API</h1>

<p align="center">A NestJS application that provides movie information using The Movie Database (TMDB) API with local caching.</p>

## Description

This project is a movie database API built with NestJS that allows users to:

- Search for movies by title
- Get detailed information about specific movies
- Store movie data locally for faster access
- Automatically update movie information daily using a scheduler

The application uses The Movie Database (TMDB) API as a data source and implements local caching to improve performance and reduce external API calls.

## Project setup

### Installation

```bash
$ npm install
```

### Environment Configuration

Before running the application, you need to set up your environment variables:

1. Create a `.env` file in the project root directory
2. Use the `.env.sample` file as a reference
3. Add your TMDB API credentials (API_KEY and READ_ACCESS_TOKEN)

Example `.env` file:
```
READ_ACCESS_TOKEN=your_tmdb_read_access_token
API_KEY=your_tmdb_api_key
TMDB_API=https://api.themoviedb.org/3
```

> **Note:** You need to register for a TMDB account and generate API credentials at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Once the application is running, you can access the API at `http://localhost:3000`.

## API Endpoints

### Movies

- `GET /movies/popular` - Get popular movies
- `GET /movies/search?query=<title>&page=<pageNumber>` - Search for movies by title
- `GET /movies/title/:title` - Get movie by title (from local DB or TMDB if not found locally)
- `GET /movies/id/:id` - Get movie details by TMDB ID
- `POST /movies` - Create a new movie in the local database
- `PUT /movies/:title` - Update a movie by title
- `PATCH /movies/:title` - Partially update a movie by title
- `DELETE /movies/:title` - Delete a movie by title

## Features

- **Movie Search**: Search for movies using the TMDB API
- **Local Database**: Store movie information in a local JSON file
- **Automatic Updates**: Daily scheduled updates of movie information
- **Fallback Mechanism**: If a movie isn't found locally, it's fetched from TMDB

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
├── src/
│   ├── app/               # Application module
│   ├── movies/            # Movies module (controller, service)
│   ├── tmdb/              # TMDB API integration
│   ├── scheduler/         # Scheduled tasks
│   └── main.ts            # Application entry point
├── .env.sample           # Sample environment variables
├── db.json               # Local database file
└── README.md             # Project documentation
```

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **MoviesModule**: Handles movie-related operations and local database interactions
- **TmdbModule**: Manages communication with the TMDB API
- **SchedulerModule**: Runs scheduled tasks to update movie information

## Deployment

This application can be deployed using standard NestJS deployment practices. For more information, see the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## Resources

### Project Resources
- [TMDB API Documentation](https://developer.themoviedb.org/reference/intro/getting-started)
- [NestJS Documentation](https://docs.nestjs.com)

### NestJS Resources
- [NestJS Discord Channel](https://discord.gg/G7Qnnhy) - For questions and support
- [NestJS Courses](https://courses.nestjs.com/) - Official video courses
- [NestJS Devtools](https://devtools.nestjs.com) - Visualize your application graph

## Troubleshooting

### Common Issues

1. **API Key Issues**: If you encounter authentication errors, verify your TMDB API credentials in the `.env` file.

2. **Database File**: If the `db.json` file is not created automatically, the application will create it on first run. Ensure the directory has write permissions.

3. **Dependency Injection Errors**: If you encounter dependency injection errors, make sure all modules are properly exported and imported.

## License

This project is [MIT licensed](LICENSE).

## Acknowledgements

- Built with [NestJS](https://nestjs.com/)
- Movie data provided by [The Movie Database (TMDB)](https://www.themoviedb.org/)
- This product uses the TMDB API but is not endorsed or certified by TMDB.
