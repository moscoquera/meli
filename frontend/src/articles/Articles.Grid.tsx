import { Grid } from "@mui/material";
import { ArticleDto } from "commons/src/patterns/articles";
import { ArticlesGridItem } from "./items/ArticleGrid.item";

export interface ArticlesGridProps {
    articles: ArticleDto[];
}

export function ArticlesGrid({ articles }: ArticlesGridProps) {


    return (
        <Grid container spacing={2} direction="row"
            justifyContent="flex-start"
            alignItems="stretch">
            {articles.map((article) => (
                <Grid key={article.id} item xs={12} md={4} lg={3}>
                    <ArticlesGridItem {...article} />
                </Grid>
            ))}
        </Grid>
    )

}