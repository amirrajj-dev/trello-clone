"use server";

import { ENV } from "@/utils/env";
import { cookies } from "next/headers";

export const setCookie = async (token: string, maxAge: number) => {
  const cookieStore = await cookies();
  const node_env = ENV.NODE_ENV || process.env.NODE_ENV
  const isProduction = node_env === "production";
  
  if (token) {
    cookieStore.set("trello-token", token, {
      httpOnly: true,
      path: "/",
      secure: isProduction,
      sameSite: isProduction ? "lax" : "lax", 
      maxAge,
    });
  }
};