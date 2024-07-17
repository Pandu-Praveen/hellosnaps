import { authRoutes, status, type UserType } from "$lib/auth";

export const ssr = false;

export async function load() {
    const user: UserType | null = await status();
    if(!user && !authRoutes.includes(window.location.pathname)){
        console.log("replaced by .ts");
        window.location.replace("/login");
        return null;
    }
    return user;
}