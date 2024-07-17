import { writable } from "svelte/store";
import api from "./api";
import { goto } from "$app/navigation";

export interface UserType {
	password?: string;
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	phone: string;
	username: string;
	role: string;
	last_sign_in: Date;
}

export const user = writable<UserType | null | undefined>(undefined);

export const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

user.subscribe((thisUser) => {
	if (!import.meta.env.SSR) {
		if (!thisUser && thisUser !== undefined && !authRoutes.includes(window.location.pathname)) {
			console.log("replaced by auth");
			goto("/login");
		}
	}
});

export const refresh = async () => {
	if (!import.meta.env.SSR) {
		const refreshToken = localStorage.getItem("refreshToken");
		if (refreshToken) {
			const response = await api.post("/auth/refresh", {
				refreshToken
			});
			if (response.status == 200) {
				user.set(response.data.user);
			} else {
				user.set(null);
			}
		}
	}
};

export const signUp = async (name: string, email: string, password: string) => {
	const response = await api.post("/auth/signup", { name, email, password });
	// console.log(email, password);
	if (response.status === 201) {
		signIn(email, password);
	}
};

export const signIn = async (email: string, password: string) => {
	const response = await api.post("/auth/login", {
		email,
		password
	});
	if (response.status === 200) {
		user.set(response.data.user);
		localStorage.setItem("refreshToken", response.data.refreshToken.tokenValue);
	}
};

export const logout = async () => {
	const response = await api.get("/auth/logout");
	if (response.status == 200) {
		user.set(null);
		localStorage.removeItem("refreshToken");
	}
};

export const status = async () => {
	const response = await api.get("/auth/status");
	if (response.status === 200) {
		return response.data.user;
	} else {
		return null;
	}
};
