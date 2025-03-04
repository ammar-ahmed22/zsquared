"use client";
import Image from "next/image";
import FlipWords from "@/components/ui/flip-words";
import AppleCarousel, { CarouselItem } from "@/components/ui/apple-carousel";

const carouselItems: CarouselItem[] = [
  {
    image: "/ghazal2.jpg",
    category: "Corporations",
    title: "Launched over 8 different ventures",
  },
  {
    image: "/umrah.png",
    category: "Creed",
    title: "Religion is a life-long journey",
  },
  {
    image: "/mountain3.jpg",
    category: "Culture",
    title: "Travelled to over 10+ countries",
  },
];
export default function Hero() {
  return (
    <section id="hero">
      <div className="max-w-4xl mx-auto mt-[30vh]">
        <div className="w-full flex flex-row items-center gap-4">
          <Image
            src="/logo-brand.png"
            alt="Logo for zsquared.ca"
            width={100}
            height={100}
            className="sm:h-20 h-14 w-auto"
          />
          <div>
            <h1 className="font-bold sm:text-5xl text-3xl font-display">
              Let&apos;s talk
              <FlipWords
                words={["Creed", "Corporations", "Culture"]}
                className="text-primary dark:text-primary"
              />
            </h1>
            <p className="text-default-500 sm:text-xl text-lg">
              Zaryab and Zaid&apos;s joint blog.
            </p>
          </div>
        </div>
      </div>
      <AppleCarousel items={carouselItems} />
    </section>
  );
}
