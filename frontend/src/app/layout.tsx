// import type { Metadata } from "next";
import "./globals.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { Toaster } from "sonner";
import Modal from "@/components/modal/Modal";

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
        <TanStackQueryProvider>{children}
        <Modal/>
        </TanStackQueryProvider>
        <Toaster/>
      </body>
    </html>
  );
}
