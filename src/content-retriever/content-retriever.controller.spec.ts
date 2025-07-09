import { Test, TestingModule } from '@nestjs/testing';
import { ContentRetrieverController } from './content-retriever.controller';
import { ContentRetrieverService } from './content-retriever.service';

describe('ContentRetrieverController', () => {
  let controller: ContentRetrieverController;
  let service: ContentRetrieverService;
  const TEST_URL = 'https://github.com'; // choose url that forsure exists..


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentRetrieverController],
      providers: [
        {
          provide: ContentRetrieverService,
          useValue: {
            submitUrlsForFetching: jest.fn(),
            getFetchedContent: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContentRetrieverController>(ContentRetrieverController);
    service = module.get<ContentRetrieverService>(ContentRetrieverService);
  });

  it('should call submitUrlsForFetching', async () => {
    const urls = [TEST_URL];
    const expectedResult = { message: 'URLs submitted for fetching. Processing in background.' };
    
    jest.spyOn(service, 'submitUrlsForFetching').mockResolvedValue(expectedResult);
    
    const result = await controller.submitUrls({ urls });
    expect(result).toEqual(expectedResult);
  });

  it('should call getFetchedContent', async () => {
    const url = TEST_URL;
    const expectedResult = { content: Buffer.from('test'), contentType: 'text/html' };
    
    jest.spyOn(service, 'getFetchedContent').mockResolvedValue(expectedResult);
    
    await controller.getFetchedContent(url, { set: jest.fn(), status: jest.fn(), send: jest.fn() } as any);
    expect(service.getFetchedContent).toHaveBeenCalledWith(url);
  });
}); 