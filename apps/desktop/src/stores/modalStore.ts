import type React from "react";
import { create } from "zustand";

export type ModalOnClose = () => void;
export type ModalCommonProps = { onClose: ModalOnClose };

export type ModalItem = {
	id: string;
	component: React.ComponentType<ModalCommonProps & Record<string, unknown>>;
	props?: Record<string, unknown>;
};

type ModalStore = {
	modals: ModalItem[];
	openModal: (
		id: string,
		component: React.ComponentType<ModalCommonProps & Record<string, unknown>>,
		props?: Record<string, unknown>,
	) => void;
	closeModal: (id: string) => void;
	closeAll: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
	modals: [],
	openModal: (id, component, props = {}) =>
		set((state) => ({
			modals: [...state.modals, { id, component, props }],
		})),
	closeModal: (id) =>
		set((state) => ({
			modals: state.modals.filter((m) => m.id !== id),
		})),
	closeAll: () => set({ modals: [] }),
}));
