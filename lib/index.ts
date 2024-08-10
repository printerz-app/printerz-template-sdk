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
): {
	register: (options?: boolean | AddEventListenerOptions) => void;
	unregister: (options?: boolean | EventListenerOptions) => void;
} => {
	const handler = async (event: CustomEvent<Record<string, unknown>>) => {
		await Promise.resolve(callback(event.detail as T));
		window.dispatchEvent(
			new CustomEvent("printerz-rendered", { detail: event.detail }),
		);
	};

	return {
		register: (options?: boolean | AddEventListenerOptions) => {
			window.addEventListener("printerz-render", handler, options);
		},
		unregister: (options?: boolean | EventListenerOptions) => {
			window.removeEventListener("printerz-render", handler, options);
		},
	};
};
