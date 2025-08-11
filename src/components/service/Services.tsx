import { getPosts } from "@/app/utils/utils";
import { Column } from "@/once-ui/components";
import { service } from "@/app/resources/content";
import { ProjectCard } from "@/components";
import styles from "./Services.module.scss";

interface ServicesProps {
  range?: [number, number?];
}

export function Services({ range }: ServicesProps) {
  /* 1. Récupère tous les fichiers MDX des services */
  const allServices = getPosts(["src", "app", "service", "items"]);

  /* 2. Trie par date de publication (descendante) */
  const sortedServices = allServices.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  /* 3. Plage optionnelle (ex. range={[1, 2]}) */
  const displayedServices = range
    ? sortedServices.slice(range[0] - 1, range[1] ?? sortedServices.length)
    : sortedServices;

  /* 4. Affichage */
  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      {displayedServices.map((post, index) => (
        <div key={post.slug} className={styles.service}>
          <ProjectCard
            priority={index < 2}
            href={`${service.path}/${post.slug}`}
            images={post.metadata.images}
            title={post.metadata.title}
            description={post.metadata.summary}
            content={post.content}
            avatars={
              post.metadata.team?.map((member) => ({ src: member.avatar })) ||
              []
            }
            link={post.metadata.link || ""}
          />
        </div>
      ))}
    </Column>
  );
}
