import { Button, Card, CardActions, CardContent, CardMedia, Link, Typography } from "@mui/material";
import { ArticleDto } from "commons";

export function ArticlesGridItem(article: ArticleDto) {

    const defaultImageUrl = 'https://dummyimage.com/600x400/ffe600/2d3277.png&text=No+Image'

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardMedia
                component="img"
                height="140"
                image={article.imageUrl}
                alt={article.title}
                onError={ e => {
                    (e.target  as any).src = defaultImageUrl
                }}
            />
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    { article.title }
                </Typography>
            </CardContent>
            <CardActions>
                <Link href={article.url} target={"_blank"}>
                    <Button size="small">Learn More</Button>
                </Link>
            </CardActions>
        </Card>
    )
}