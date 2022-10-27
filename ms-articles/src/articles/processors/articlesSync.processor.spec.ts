import { Test, TestingModule } from "@nestjs/testing";
import { Job } from "bull";
import { mock, MockProxy } from "jest-mock-extended";
import { ArticlesService } from "../services/articles.service";
import { ArticlesSync } from "./articlesSync.processor";

describe('tests for articles cache queue processor ', () => {

    let processor: ArticlesSync;
    let serviceMock: MockProxy<ArticlesService>;

    const mockArticle= {
        id: 17002,
        title: "Space Force tries to turn over a new leaf in satellite procurement",
        url: "https://spacenews.com/space-force-tries-to-turn-over-a-new-leaf-in-satellite-procurement/",
        imageUrl: "https://spacenews.com/wp-content/uploads/2022/10/Screen-Shot-2022-10-20-at-8.55.19-AM.png"
    };

    const mockJobData: Job = {
        data:mockArticle,
        progress: ()=>{},
        moveToCompleted: () => {}
    } as Job

    beforeEach(async () => {

        serviceMock = mock<ArticlesService>();
        const module: TestingModule = await Test.createTestingModule({
          providers: [ArticlesSync,
            {
            provide: ArticlesService,
            useValue: serviceMock,
          }],
        }).compile();
    
        processor = module.get<ArticlesSync>(ArticlesSync);
      });


      describe('tests for transcode function', () => {

        it('should call articles.listOrSchedule method', async ()=>{
            serviceMock.addOrUpdate.mockResolvedValue(null);
            const result = await processor.transcode(mockJobData)
            expect(serviceMock.addOrUpdate).toBeCalledWith(mockArticle);
            expect(result).toEqual({'status':'ok'})
        });

      })

})