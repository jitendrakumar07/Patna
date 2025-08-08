"use client";

import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      9️⃣ Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
