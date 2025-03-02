"use client";
import { PostMetadata } from "@/types/api";
import { SparklesIcon } from "lucide-react";
import PostCard from "@/components/ui/post-card";

export type FeaturedProps = {
  posts: PostMetadata[];
};

export default function Featured({ posts }: FeaturedProps) {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="w-full">
        <div className="flex gap-2 items-center justify-center w-full">
          <SparklesIcon className="size-14 fill-primary stroke-primary" />
          <h2 className="font-display sm:text-6xl text-4xl font-bold">
            Featured
          </h2>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        {posts.map((post, i) => {
          const isLast = i === posts.length - 1;
          return (
            <PostCard key={post.slug} post={post} isLast={isLast} />
          );
        })}
      </div>
    </section>
  );
}
