import { getSortedArticles, Article } from "@/app/utils/articleUtils";
import { Grid } from "@/once-ui/components";
import Post from "./Post";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
}

export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  direction,
}: PostsProps) {
  const sortedArticles = getSortedArticles();

  const displayedArticles = range
    ? sortedArticles.slice(
        range[0] - 1,
        range.length === 2 ? range[1] : sortedArticles.length
      )
    : sortedArticles;

  return (
    <>
      {displayedArticles.length > 0 && (
        <Grid
          columns={columns}
          mobileColumns="1"
          fillWidth
          marginBottom="40"
          gap="12"
        >
          {displayedArticles.map((article) => (
            <Post
              key={article.slug}
              article={article}
              thumbnail={thumbnail}
              direction={direction}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
