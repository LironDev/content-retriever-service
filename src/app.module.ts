import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContentRetrieverModule } from './content-retriever/content-retriever.module';
import { FetchedUrl } from './content-retriever/entities/fetched-url.entity'; // Import the entity

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite', // db type, this can be changed to mysql
      database: process.env.DATABASE_PATH || './data/db.sqlite',
      entities: [FetchedUrl], // all entities that TypeORM should manage
      synchronize: true, // this is ok for now, in prod there's a need for a migration step
      logging: ['query', 'error'], // log sql queries and errors for debugging
    }),
    ContentRetrieverModule, // import feature module
  ],
})
export class AppModule {}