import { api } from "@/lib/api";
import Metadata from "./metadata";
export type BlogPostProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost(props: BlogPostProps) {
  const { slug } = await props.params;
  const { metadata, content } = await api.posts.content({ slug });
  console.log({ metadata, content });
  return (
    <div className="max-w-4xl mx-auto">
      <Metadata metadata={metadata} />
    </div>
  );
}
