import { create } from "zustand";
import type { User } from "../types/index.js";

interface UserStore {
	user: User | null;
	isAuthenticated: boolean;
	setUser: (user: User | null) => void;
	logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
	logout: () => set({ user: null, isAuthenticated: false }),
}));
