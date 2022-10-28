import { Test, TestingModule } from "@nestjs/testing";
import { mock, MockProxy } from "jest-mock-extended";
import { SpaceArticleDto } from "../../dtos/SpaceArticle.dto";
import { MSArticlesService } from "../services/ms-articles.service";
import { ArticlesFetchedListener } from "./articles-fetched.listerner";

describe('tests for articles-fetched listener', () => {

    let listener: ArticlesFetchedListener;
    let serviceMock: MockProxy<MSArticlesService>;

    const mockData: SpaceArticleDto[] = [
        {
            id: 17001,
            title: "Why NASA Is Trying To Crash Land on Mars",
            url: "https://mars.nasa.gov/news/9283/",
            imageUrl: "https://mars.nasa.gov/system/news_items/main_images/9283_1-Illustration-of-SHIELD-web.jpg",
            newsSite: "NASA",
            summary: "Like a car’s crumple zone, the experimental SHIELD lander is designed to absorb a hard impact.",
            publishedAt: new Date("2022-10-20T17:13:00.000Z"),
            updatedAt: new Date("2022-10-20T17:13:35.034Z"),
            featured: false,
            launches: [],
            events: [],
            remoteIndex:1
          },
          new SpaceArticleDto()
    ];

    beforeEach(async () => {

        serviceMock = mock<MSArticlesService>();
        const module: TestingModule = await Test.createTestingModule({
          providers: [ArticlesFetchedListener,
            {
            provide: MSArticlesService,
            useValue: serviceMock,
          }],
        }).compile();
    
        listener = module.get<ArticlesFetchedListener>(ArticlesFetchedListener);
      });


      describe('tests for articles_fetched', () => {

        it('should call articles.send method', ()=>{

            listener.handle(mockData)

            expect(serviceMock.send).toBeCalledWith(mockData);

        });
      })

})