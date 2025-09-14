import { useModalStore } from "../stores/modalStore";

export const ModalContainer = () => {
	const { modals, closeModal } = useModalStore();

	return (
		<>
			{modals.map(({ id, component: Component, props }) => (
				<Component key={id} {...(props ?? {})} onClose={() => closeModal(id)} />
			))}
		</>
	);
};
