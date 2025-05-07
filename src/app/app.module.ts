import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoviesModule } from '../movies/movies.module';
import { TmdbModule } from '../tmdb/tmdb.module';
import { SchedulerModule } from 'src/scheduler/scheduler.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      expandVariables: true,
      cache: true,
      validate: (config: Record<string, string>) => {
        const logger = new Logger('ConfigValidation');
        const requiredEnvVars = ['API_KEY', 'READ_ACCESS_TOKEN'];
        const missingVars: string[] = [];
        
        for (const envVar of requiredEnvVars) {
          if (!config[envVar]) {
            missingVars.push(envVar);
          }
        }
        
        if (missingVars.length > 0) {
          const envPath = path.join(process.cwd(), '.env');
          const envExists = fs.existsSync(envPath);
          
          logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
          logger.error(`Environment file ${envExists ? 'exists' : 'does not exist'} at: ${envPath}`);
          
          if (!envExists) {
            logger.error(`Please create a .env file in the project root with the following variables:\n${requiredEnvVars.map(v => `${v}=your_value_here`).join('\n')}`);
          }
          
          throw new Error(`Configuration validation failed. Missing required environment variables: ${missingVars.join(', ')}`);
        }
        
        logger.log('Configuration validation successful');
        return config;
      },
    }),
    MoviesModule,
    TmdbModule,
    SchedulerModule,
  ],
  providers: [
    {
      provide: 'APP_INITIALIZER',
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('AppInitializer');
        const apiKey = configService.get('API_KEY');
        const accessToken = configService.get('READ_ACCESS_TOKEN');
        
        logger.log('Application initialized with configuration');
        logger.log(`API credentials ${apiKey && accessToken ? 'are' : 'are NOT'} properly configured`);
        
        return {};
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
