import { Controller, Post, Get, Body, HttpCode, HttpStatus, Logger, Query, Res, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContentRetrieverService } from './content-retriever.service';
import { Response } from 'express';
import { UrlsDto } from './dto/urls.dto';
import { validateUrl } from '../utils/url.utils';

@Controller('fetch')
export class ContentRetrieverController {
  private readonly logger = new Logger(ContentRetrieverController.name);

  constructor(private readonly contentRetrieverService: ContentRetrieverService) {}

  @Post('/')
  @HttpCode(HttpStatus.ACCEPTED) // this return 202 Accepted, because the processing is async
  async submitUrls(@Body() urlsDto: UrlsDto): Promise<{ message: string }> {
    this.logger.log(`Received ${urlsDto.urls.length} URLs to fetch`);
    return this.contentRetrieverService.submitUrlsForFetching(urlsDto.urls);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getFetchedContent(@Query('url') url: string, @Res() res: Response) {
    this.logger.log(`Received GET request for content of url: ${url}`);
    if (!url) {
      return res.status(400).send('Missing url parameter');
    }
    
    if (!validateUrl(url)) {
      return res.status(400).send('Invalid URL');
    }

    const result = await this.contentRetrieverService.getFetchedContent(url);
    if (!result) {
      return res.status(404).send('Content not found');
    }
    res.set('Content-Type', result.contentType);
    return res.send(result.content);
  }
}
