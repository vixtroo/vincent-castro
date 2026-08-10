"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type ThemeToggleProps = {
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
};

export default function ThemeToggle({ theme, onThemeChange }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const activeTheme = theme ?? savedTheme;

    if (activeTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";

    setIsDark(newTheme === "dark");
    onThemeChange?.(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-16 right-6 flex h-10 w-10 items-center justify-center rounded-full
                 text-gray-800 transition
                 bg-gray-100
                 dark:text-yellow-300 dark:bg-gray-800 cursor-pointer shadow-lg -rotate-50 hover:-rotate-15"
      aria-label="Toggle dark mode"
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
    </button>
  );
}