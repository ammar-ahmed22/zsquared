import { api } from "@/lib/api";
import Metadata from "./metadata";
import Block from "./block";
import { Metadata as NextMetadata } from "next";
import { toPlainText } from "@/lib/notion/utils";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await api.posts.list({ onlyPublished: true });
  return posts.map((post) => {
    return {
      slug: post.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<NextMetadata> {
  const { slug } = await params;
  const [post] = await api.posts.list({ slug });
  const description = toPlainText(post.description);
  return {
    title: post.name,
    description,
    openGraph: {
      type: "article",
      description,
      siteName: "zsquared.ca",
      title: post.name,
      images: [
        post.image ??
          `/api/og?title=${encodeURIComponent(post.name)}&description=${encodeURIComponent(description)}`,
      ],
      url: "https://zsquared.ca/blog/" + post.slug,
    },
  };
}

export type BlogPostProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost(props: BlogPostProps) {
  const { slug } = await props.params;
  const { metadata, content } = await api.posts.content({ slug });
  return (
    <div className="max-w-4xl mx-auto">
      <Metadata metadata={metadata} />
      <div className="flex flex-col w-full gap-3">
        {content.map((block) => {
          return <Block key={block.id} block={block} />;
        })}
      </div>
    </div>
  );
}
