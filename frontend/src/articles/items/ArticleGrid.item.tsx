import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { ArticleMessage } from "commons";

export function ArticlesGridItem(article: ArticleMessage) {

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    { article.title }
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}