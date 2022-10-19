export interface Launch {
    id: string;
    provider: string;
}

export interface Event {
    id: number;
    provider: string;
}

export class SpaceArticleDto {
    id: number;
    title: string;
    url: string;
    imageUrl: string;
    newsSite: string;
    summary: string;
    publishedAt: Date;
    updatedAt: Date;
    featured: boolean;
    launches: Launch[];
    events: Event[];
}