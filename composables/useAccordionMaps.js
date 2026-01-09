export default function useAccordionMaps() {
	const accordionMaps = useState(() => ({
		headers: {},
		panels: {},
	}));

	// Return cleanup function separately to avoid serialization issues
	const cleanup = (type, id) => {
		if (accordionMaps.value[type]?.[id]) {
			delete accordionMaps.value[type][id];
		}
		// Also cleanup from instances map if it exists
		if (accordionMaps.value.instances) {
			accordionMaps.value.instances.delete(`${type}:${id}`);
		}
	};

	// Cleanup on scope dispose
	onScopeDispose(() => {
		if (accordionMaps.value) {
			accordionMaps.value.headers = {};
			accordionMaps.value.panels = {};
		}
	});

	return {
		maps: accordionMaps.value,
		cleanup
	};
}
