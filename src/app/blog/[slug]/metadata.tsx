"use client";
import { PostMetadata } from "@/types/api";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

export type MetadataProps = {
  metadata: PostMetadata;
};

export default function Metadata({ metadata }: MetadataProps) {
  return (
    <div className="flex flex-col gap-4">
      <a
        href="/blog"
        className={buttonVariants({
          variant: "ghost",
          className: "w-fit",
        })}>
        <ArrowLeftIcon className="size-4" />
        Back
      </a>
      <div>
        <p className="font-bold uppercase">
          {metadata.categories.join(" • ")}
        </p>
        <h1 className="text-4xl font-display font-bold">
          {metadata.name}
        </h1>
      </div>
      {metadata.image && (
        <Image
          src={metadata.image}
          alt={metadata.name + " cover image"}
          width={1600}
          height={900}
          className="h-72 w-full object-cover rounded-lg"
        />
      )}
      <div className="text-lg text-neutral">
        <p>{metadata.authors.join(", ")}</p>
        {metadata.date && (
          <p>{format(metadata.date, "MMM dd, yyyy")}</p>
        )}
      </div>
    </div>
  );
}
