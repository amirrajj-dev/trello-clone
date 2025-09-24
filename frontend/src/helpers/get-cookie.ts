"use server";

import { cookies } from "next/headers";

export const getCookie = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("trello-token");
  if (cookie) {
    return cookie.value;
  } else {
    return null;
  }
};
