
export class ListMessage {
    page: number=1;
    size: number=10;
}

export class ArticleMessage {
    id: number;
    title: string;
    url: string;
    imageUrl: string;
}

export class ScheduleJoMessage {
    name: string;
    data: unknown;
}
  