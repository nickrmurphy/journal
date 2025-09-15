import { create } from "zustand";

export const useUserStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	setUser: (user: unknown) => set({ user, isAuthenticated: !!user }),
	logout: () => set({ user: null, isAuthenticated: false }),
})) as any;
