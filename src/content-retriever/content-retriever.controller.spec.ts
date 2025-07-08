import { Test, TestingModule } from '@nestjs/testing';
import { ContentRetrieverController } from './content-retriever.controller';
import { BadRequestException } from '@nestjs/common';

describe('ContentRetrieverController', () => {
  let controller: ContentRetrieverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentRetrieverController],
    }).compile();

    controller = module.get<ContentRetrieverController>(ContentRetrieverController);
  });

  it('should throw BadRequestException for invalid input', async () => {
    await expect(controller.submitUrls({ urls: [] })).rejects.toThrow(BadRequestException);
  });
}); 