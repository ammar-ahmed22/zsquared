import Hero from "./components/hero";
import Featured from "./components/featured";
import { api } from "@/lib/api";

export default async function Home() {
  const featuredPosts = await api.posts.list({
    onlyFeatured: true,
    onlyPublished: process.env.NODE_ENV === "production",
  });
  return (
    <>
      <Hero />
      {featuredPosts.length > 0 && <Featured posts={featuredPosts} />}
    </>
  );
}
