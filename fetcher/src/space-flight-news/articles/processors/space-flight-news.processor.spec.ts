import { Test, TestingModule } from "@nestjs/testing";
import { Job } from "bull";
import { mock, MockProxy } from "jest-mock-extended";
import { ScheduleJobDto } from "../../dtos/scheduledJob.dto";
import { SpaceFlightNewsService } from "../services/space-flight-news.service";
import { SpaceFlightNewProcessor } from "./space-flight-news.processor";

describe('tests for articles request queue processor ', () => {

    let processor: SpaceFlightNewProcessor;
    let serviceMock: MockProxy<SpaceFlightNewsService>;

    const mockJobData: Job = {
        data:{
            size:20,
            page:8
        },
        progress: ()=>{},
        moveToCompleted: () => {}
    } as Job

    beforeEach(async () => {

        serviceMock = mock<SpaceFlightNewsService>();
        const module: TestingModule = await Test.createTestingModule({
          providers: [SpaceFlightNewProcessor,
            {
            provide: SpaceFlightNewsService,
            useValue: serviceMock,
          }],
        }).compile();
    
        processor = module.get<SpaceFlightNewProcessor>(SpaceFlightNewProcessor);
      });


      describe('tests for transcode function', () => {

        it('should call articles.listOrSchedule method', async ()=>{
            serviceMock.listOrSchedule.mockResolvedValue([]);
            await processor.transcode(mockJobData)
            expect(serviceMock.listOrSchedule).toBeCalledWith(8,20);
            expect(serviceMock.scheduleNextPull).toBeCalled();
        });

        it('should call console.warn', async ()=>{
            const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
            serviceMock.listOrSchedule.mockResolvedValue(new ScheduleJobDto());
            await processor.transcode(mockJobData)
            expect(warn).toBeCalled()
            expect(serviceMock.scheduleNextPull).toBeCalled();
        });
      })

})