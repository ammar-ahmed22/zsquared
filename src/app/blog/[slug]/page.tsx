import { api } from "@/lib/api";
export type BlogPostProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPost(props: BlogPostProps) {
  const { slug } = await props.params;
  const { metadata, content } = await api.posts.content({ slug });
  console.log({ metadata, content });
  return <div>Blog post. Coming soon...</div>;
}
