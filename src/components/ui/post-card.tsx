"use client";
import { PostMetadata } from "@/types/api";
import { Card, CardHeader, CardContent } from "./card";
import RichText from "./rich-text";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type PostCardProps = {
  post: PostMetadata;
  isLast?: boolean;
};

export default function PostCard({
  post,
  isLast = false,
}: PostCardProps) {
  return (
    <>
      <a href={`/blog/${post.slug}`}>
        <Card
          className={cn(
            "border-none shadow-none hover:bg-neutral-200/40",
            {
              "pt-0": !!post.image,
            },
          )}>
          {post.image && (
            <Image
              src={post.image}
              alt={post.name + " cover image"}
              width={1600}
              height={900}
              className="h-72 w-full object-cover rounded-t-lg"
            />
          )}
          <CardHeader>
            <small className="font-bold uppercase">
              {post.categories.join(" • ")}
            </small>
            <span className="text-neutral">
              {post.authors.join(", ")}
            </span>
            <h2 className="font-display font-semibold sm:text-2xl text-xl">
              {post.name}
            </h2>
          </CardHeader>
          <CardContent>
            <RichText text={post.description} as="p" />
            <span className="text-primary font-semibold hover:underline">
              Read more
            </span>
          </CardContent>
        </Card>
      </a>
      {!isLast && <hr />}
    </>
  );
}
