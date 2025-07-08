import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentRetrieverService } from './content-retriever.service';
import { ContentRetrieverController } from './content-retriever.controller';
import { FetchedUrl } from './entities/fetched-url.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FetchedUrl]), // register the FetchedUrl entity with TypeORM
  ],
  controllers: [ContentRetrieverController],
  providers: [ContentRetrieverService],
})
export class ContentRetrieverModule {}
