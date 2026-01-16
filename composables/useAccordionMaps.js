export default function useAccordionMaps() {
	// For SSR, avoid global state accumulation
	const accordionMaps = useState(() => ({
		headers: {},
		panels: {},
	}));

	const cleanup = (type, id) => {
		if (accordionMaps.value[type]?.[id]) {
			delete accordionMaps.value[type][id];
		}
	};

	const updateComponent = (type, id, updates) => {
		if (accordionMaps.value[type][id]) {
			Object.assign(accordionMaps.value[type][id], updates);
		}
	};

	const registerHeader = (id, data) => {
		accordionMaps.value.headers[id] = {
			...data,
			update: (updates) => updateComponent('headers', id, updates),
			cleanup: () => cleanup('headers', id),
		};
	};

	const registerPanel = (id, data) => {
		accordionMaps.value.panels[id] = {
			...data,
			update: (updates) => updateComponent('panels', id, updates),
			cleanup: () => cleanup('panels', id),
		};
	};

	// Enhanced cleanup for SSR
	const cleanupAll = () => {
		if (accordionMaps.value) {
			// Cleanup all registered components
			Object.keys(accordionMaps.value.headers).forEach(id => {
				if (accordionMaps.value.headers[id]?.cleanup) {
					accordionMaps.value.headers[id].cleanup();
				}
			});
			Object.keys(accordionMaps.value.panels).forEach(id => {
				if (accordionMaps.value.panels[id]?.cleanup) {
					accordionMaps.value.panels[id].cleanup();
				}
			});

			accordionMaps.value.headers = {};
			accordionMaps.value.panels = {};
		}
	};

	// Cleanup on scope dispose
	onScopeDispose(cleanupAll);

	// Additional cleanup for SSR
	if (import.meta.server) {
		onBeforeUnmount(cleanupAll);
	}

	return {
		maps: accordionMaps,
		registerHeader,
		registerPanel,
		cleanup: cleanupAll,
	};
}
