"use client";

import { useTheme } from "@/stores/theme.store";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || theme
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);
  return <div>{children}</div>;
}
