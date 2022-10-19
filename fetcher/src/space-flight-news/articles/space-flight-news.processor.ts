
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { ListMessage } from 'commons';
import { ScheduleJobDto } from '../dtos/scheduledJob.dto';
import { SpaceFlightNewsService } from './space-flight-news.service';

@Processor('articles_request')
export class SpaceFlightNewProcessor {

    constructor(@Inject(SpaceFlightNewsService) private articlesService: SpaceFlightNewsService){}

  @Process()
  async transcode(job: Job<unknown>) {
      console.log("SpaceFlightNewProcessor > processing job: "+job.id)
      const jobData = job.data as ListMessage;
      const result = await this.articlesService.listOrSchedule(jobData.page, jobData.size);
      await job.progress(1);
      if(result instanceof ScheduleJobDto){ //scheduled again, do nothing, shouldn't happen
         console.warn("invalid state for:"+jobData)
         console.log(jobData)
      }
      else{
        //console.log('SpaceFlightNewProcessor > transcode > 26 '+result.length+" "+ typeof result)
      }

      await this.articlesService.scheduleNextPull();
      
      await job.moveToCompleted();
      
    return;
  }

}