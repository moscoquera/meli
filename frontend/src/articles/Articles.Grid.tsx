import { Grid } from "@mui/material";
import { ArticleMessage } from "commons";
import { ArticlesGridItem } from "./items/ArticleGrid.item";

export interface ArticlesGridProps {
    articles: ArticleMessage[];
}

export function ArticlesGrid({articles}: ArticlesGridProps) {


    return (
        <Grid container spacing={2}>
            { articles.map((article) => (
                <Grid item xs={12} md={4} lg={3}>
                    <ArticlesGridItem {...article} />
                </Grid>
            )) }
        </Grid>
    )

}