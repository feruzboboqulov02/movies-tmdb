import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from '../movies/movies.module';
import { TmdbModule } from '../tmdb/tmdb.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, string>) => {
        const requiredEnvVars = ['API_KEY', 'READ_ACCESS_TOKEN'];
        for (const envVar of requiredEnvVars) {
          if (!config[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
          }
        }
        return config;
      },
    }),
    SchedulerModule,
    MoviesModule,
    TmdbModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
