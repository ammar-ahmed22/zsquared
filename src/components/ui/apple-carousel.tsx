"use client";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import Image from "next/image";

export type CarouselProps = {
  items: CarouselItem[];
  initialScroll?: number;
};

export type CarouselItem = CarouselCardProps;

export default function AppleCarousel({
  items,
  initialScroll = 0,
}: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      <div
        className="flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth [scrollbar-width:none]"
        ref={carouselRef}
        onScroll={checkScrollability}
      >
        <div
          className={cn(
            "absolute right-0  z-[1000] h-auto  w-[5%] overflow-hidden bg-gradient-to-l",
          )}
        />
        <div className={cn("flex flex-row justify-start gap-4 sm:pl-4 pl-0")}>
          {items.map((item, index) => (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 0.2 * index,
                  ease: "easeOut",
                  once: true,
                },
              }}
              key={"card" + index}
              className="last:pr-[5%] md:last:pr-[33%]  rounded-3xl"
            >
              <CarouselCard {...item} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 mr-10">
        <button
          className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ArrowLeftIcon className="size-5 text-gray-500" />
        </button>
        <button
          className="relative z-40 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50"
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <ArrowRightIcon className="size-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}

export type CarouselCardProps = {
  image: string;
  category: string;
  title: string;
};
export const CarouselCard = ({ image, category, title }: CarouselCardProps) => {
  return (
    <>
      <motion.div className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-[30vw] overflow-hidden flex flex-col items-start justify-start relative z-10">
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p className="text-white text-sm md:text-base font-medium font-sans text-left">
            {category}
          </motion.p>
          <motion.p className="text-white text-xl md:text-2xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2">
            {title}
          </motion.p>
        </div>
        <Image
          src={image}
          width={1600}
          height={900}
          alt=""
          className="object-cover absolute z-10 inset-0 transition duration-300 h-full w-full"
        />
      </motion.div>
    </>
  );
};
