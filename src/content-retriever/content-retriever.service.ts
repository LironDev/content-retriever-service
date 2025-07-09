import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Buffer } from 'buffer';
import { FetchedUrl } from './entities/fetched-url.entity';
import { sanitizeUrl } from '../utils/url.utils';
import { isTextBasedContentType } from '../utils/content.utils';

@Injectable()
export class ContentRetrieverService {
  private readonly logger = new Logger(ContentRetrieverService.name);
  private readonly DEFAULT_TTL_MS = 60 * 60 * 1000; // 1h
  private readonly FETCH_TIMEOUT = 10 * 1000; // 10sec
  private UrlCache = new Map(); // will hold {url: {expiresAt}}}

  constructor(
    @InjectRepository(FetchedUrl)
    private fetchedUrlRepository: Repository<FetchedUrl>,
  ) {}

  // submit urls for fetching
  async submitUrlsForFetching(urls: string[]): Promise<{ message: string }> {
    this.logger.log(`Received request to fetch ${urls.length} URLs.`);

    // process each url asynchronously without blocking the main thread
    urls.forEach(async (url) => {
      try {
        url = sanitizeUrl(url);
        // check if a fresh version of this url already exists in the cache
        const existingEntry = this.UrlCache.get(url) || await this.fetchedUrlRepository.findOne({
          where: { originalUrl: url },
          order: { fetchedAt: 'DESC' }, // get recent
        });

        if (existingEntry && existingEntry?.expiresAt > new Date()) { // cache/db has fresh record
          if (!this.UrlCache.has(url)) this.UrlCache.set(url, {expiresAt: existingEntry.expiresAt}); // incase url only on db and its frash, add it to cache
          this.logger.log(`Serving ${url} from fresh cache. No re-fetch needed.`);
          return;
        } else {
          this.UrlCache.delete(url); // remove from cache if not fresh
        }

        // fetch content
        const response = await axios.get(url, {
          timeout: this.FETCH_TIMEOUT,
          responseType: 'arraybuffer', // get raw binary data
          maxRedirects: 5, // axios handle redirects, prevent infinite loops
        });

        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const contentBuffer = Buffer.from(response.data);

        let contentForDb: Buffer = contentBuffer;
        let contentEncoding = 'binary'; // default for binary content

        if (isTextBasedContentType(contentType)) { // if text based content type, convert to string
          try {
            contentForDb = Buffer.from(contentBuffer.toString('utf8')); // store as utf8 encoded buffer
            contentEncoding = 'utf8';
          } catch (e) {
            this.logger.warn(`Failed to decode text content for ${url}, storing as raw binary. Error: ${e.message}`);
            // fallback: keep as binary
          }
        }

        const finalUrl = response.request.res.responseUrl || url; // final url after redirects

        const expiresAt = new Date(Date.now() + this.DEFAULT_TTL_MS);

        let fetchedEntry: FetchedUrl;
        if (existingEntry && existingEntry.expiresAt && existingEntry.expiresAt <= new Date()) {
            // Update existing expired entry
            fetchedEntry = existingEntry;
            this.logger.log(`Updating expired entry for ${url}.`);
        } else {
            fetchedEntry = this.fetchedUrlRepository.create();
            this.logger.log(`Creating new entry for ${url}.`);
        }

        Object.assign(fetchedEntry, {
          originalUrl: url,
          finalUrl: finalUrl,
          httpStatus: response.status,
          contentType: contentType.split(';')[0].trim(), // only content type, no need the charset
          content: contentForDb,
          contentEncoding: contentEncoding,
          fetchedAt: new Date(),
          expiresAt,
        });

        this.UrlCache.set(url, {expiresAt});
        await this.fetchedUrlRepository.save(fetchedEntry);
        this.logger.log(`Successfully fetched and stored content for: ${url}`);

      } catch (error) {
        this.logger.error(`Failed to fetch or store content for ${url}: ${error.message}`);
        // handle different types of errors (like network, HTTP status codes)
        const httpStatus = error.response ? error.response.status : null;
        const errorMessage = error.message || 'Unknown error during fetch';

        const expiresAt = new Date(Date.now() + this.DEFAULT_TTL_MS / 4); // shorter ttl for error entries
        // save an error entry to the database
        const errorEntry = this.fetchedUrlRepository.create({
          originalUrl: url,
          httpStatus,
          error: errorMessage,
          fetchedAt: new Date(),
          expiresAt
        });
        this.UrlCache.set(errorEntry.originalUrl, {expiresAt});
        await this.fetchedUrlRepository.save(errorEntry);
      }
    });

    return { message: 'URLs submitted for fetching. Processing in background.' };
  }

  // get fetched content, will return as original url with the content type
  async getFetchedContent(url: string): Promise<{ content: Buffer; contentType: string } | null> {
    url = sanitizeUrl(url);
    const record = await this.fetchedUrlRepository.findOne({
      where: { originalUrl: url },
      order: { fetchedAt: 'DESC' },
    });

    if (!record || !record.content) return null;

    // trigger re-fetch if expired
    if (record.expiresAt && record.expiresAt <= new Date() && record.error === null) {
      this.logger.log(`Content for ${record.originalUrl} expired. Triggering re-fetch.`);
      await this.submitUrlsForFetching([record.originalUrl]);
    }

    return {
      content: record.content,
      contentType: record.contentType || 'application/octet-stream',
    };
  }
}
