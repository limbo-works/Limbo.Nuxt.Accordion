export default function useAccordionMaps() {
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

	// Cleanup on scope dispose
	onScopeDispose(() => {
		if (accordionMaps.value) {
			accordionMaps.value.headers = {};
			accordionMaps.value.panels = {};
		}
	});

	return {
		maps: accordionMaps,
		registerHeader,
		registerPanel,
	};
}
