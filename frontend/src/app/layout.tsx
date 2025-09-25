import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
        <Toaster/>
      </body>
    </html>
  );
}
