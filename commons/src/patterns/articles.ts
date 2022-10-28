
export class ListMessage {
    page: number=1;
    size: number=10;
}

export class ArticleDto {
    id: number =0;
    title: string = '';
    url: string = '';
    imageUrl: string = '';
}

export class ArticleMessage extends ArticleDto{
    remoteIndex: number = 0;
}

export class ScheduleJoMessage {
    name: string = '';
    data: unknown = '';
}
  