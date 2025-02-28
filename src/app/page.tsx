import ThemeButton from "./theme-button";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-primary font-display font-bold text-4xl">
        hello world
      </h1>
      <ThemeButton />
    </div>
  );
}
