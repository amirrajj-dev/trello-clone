// import type { Metadata } from "next";
import "./globals.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { Toaster } from "sonner";
import Modal from "@/components/modal/Modal";
import { SocketProvider } from "@/contexts/socket-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <TanStackQueryProvider>
          <SocketProvider>{children}</SocketProvider>
          <Modal />
        </TanStackQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
