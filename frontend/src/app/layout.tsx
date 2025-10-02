import "./globals.css";
import TanStackQueryProvider from "@/providers/tanstack-provider";
import { Toaster } from "sonner";
import Modal from "@/components/modal/Modal";
import { SocketProvider } from "@/contexts/socket-context";
import { Metadata } from "next";

export const metadata: Metadata = {
  icons : {
    icon : "/trello.ico",
  }
}

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
