import { IsArray, ArrayNotEmpty, IsUrl } from 'class-validator';

export class UrlsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUrl({ require_protocol: false, require_tld: false }, { each: true })
  urls: string[];
}