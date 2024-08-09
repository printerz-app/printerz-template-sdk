declare global {
	interface Window {
		printerzRender: (variables: Record<string, unknown>) => void;
	}

	interface GlobalEventHandlersEventMap {
		"printerz-render": CustomEvent<Record<string, unknown>>;
		"printerz-rendered": CustomEvent<Record<string, unknown>>;
	}
}

export const setup = () => {
	window.printerzRender = (variables) => {
		window.dispatchEvent(
			new CustomEvent("printerz-render", { detail: variables }),
		);
	};
};

export const onRender = <T extends Record<string, unknown>>(
	callback: (variables: T) => void,
	{ once = false } = {},
) => {
	const handler = async (event: CustomEvent<Record<string, unknown>>) => {
		await Promise.resolve(callback(event.detail as T));
		window.dispatchEvent(
			new CustomEvent("printerz-rendered", { detail: event.detail }),
		);
	};

	window.addEventListener("printerz-render", handler, { once });

	return () => {
		window.removeEventListener("printerz-render", handler);
	};
};
