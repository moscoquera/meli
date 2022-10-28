
export class ListMessage {
    page: number=1;
    size: number=10;
}

export class ArticleDto {
    id: number;
    title: string;
    url: string;
    imageUrl: string;
}

export class ArticleMessage extends ArticleDto{
    remoteIndex: number;
}

export class ScheduleJoMessage {
    name: string;
    data: unknown;
}
  