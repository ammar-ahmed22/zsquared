import { api } from "@/lib/api";
import { BookIcon } from "lucide-react";
import PostCard from "@/components/ui/post-card";

export default async function Blog() {
  const posts = await api.posts.list({
    onlyPublished: process.env.NODE_ENV === "production",
  });
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="w-full flex flex-col items-center">
        <div className="flex gap-2 items-center">
          <BookIcon className="size-8 fill-primary" />
          <h1 className="font-display font-bold text-4xl text-center">
            Articles
          </h1>
        </div>
        <p className="text-lg">
          Creed, coroporations, culture, and everything in between.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {posts.map((post, i) => {
          const isLast = i === posts.length - 1;
          return (
            <PostCard post={post} isLast={isLast} key={post.id} />
          );
        })}
      </div>
    </div>
  );
}
