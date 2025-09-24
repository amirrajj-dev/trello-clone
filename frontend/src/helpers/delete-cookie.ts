'use server'

import { cookies } from "next/headers"

export const deleteCookie = async () => {
    const cookieStore = await cookies()
    const cookie = cookieStore.get("trello-token")
    if (cookie && cookie?.value) {
        cookieStore.delete("trello-token")
        return true
    }else{
        return false
    }
}