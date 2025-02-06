let accordionMaps;
export default function useAccordionMaps() {
	accordionMaps ??= reactive({
		headers: {},
		panels: {},
	});
	return accordionMaps;
}
