"use server";

import { cookies } from "next/headers";

export const setCookie = async (token: string , maxAge : number , expires : number) => {
  const cookieStore = await cookies();
  if (token) {
    cookieStore.set("trello-token", token , {
        httpOnly : true ,
        path : "/",
        secure : true ,
        sameSite : "strict",
        maxAge,
        expires
    });
  }
};
