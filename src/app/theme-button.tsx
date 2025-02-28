"use client";
import { Button } from "@/components/ui/button";
import { useThemeValue, useToggleTheme } from "@/hooks/theme";
import { MoonIcon, SunIcon } from "lucide-react";

export default function ThemeButton() {
  const toggleTheme = useToggleTheme();
  const Icon = useThemeValue(MoonIcon, SunIcon);
  return (
    <Button
      className="cursor-pointer"
      size="icon"
      onClick={() => toggleTheme()}>
      <Icon />
    </Button>
  );
}
