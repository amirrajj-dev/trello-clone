"use server";

import { cookies } from "next/headers";

export const setCookie = async (token: string, maxAge: number) => {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  
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