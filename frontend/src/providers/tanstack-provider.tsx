"use client";

import queryClient from "@/utils/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function TanStackQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
