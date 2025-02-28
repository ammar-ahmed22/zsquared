"use client";
import { SiLinkedin } from "react-icons/si";
import { buttonVariants } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="mt-40 border-t flex flex-col items-center justify-center pt-4 pb-8">
      <span className="font-bold">Connect with us!</span>
      <div className="flex items-center mb-2">
        <a
          href="https://www.linkedin.com/in/zaryab-ahmed/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "ghost",
          })}>
          Zaryab <SiLinkedin className="size-4 text-primary" />
        </a>
        <a
          href="https://www.linkedin.com/in/zaid-marfatia/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({
            variant: "ghost",
          })}>
          Zaid <SiLinkedin className="size-4 text-primary" />
        </a>
      </div>
      <span className="text-sm text-neutral">
        Built and Designed by{" "}
        <a
          href="https://ammarahmed.ca"
          className="text-primary hover:underline">
          Ammar Ahmed
        </a>
      </span>
      <small className="text-xs text-neutral">
        All Rights Reserved © 2025
      </small>
    </footer>
  );
}
