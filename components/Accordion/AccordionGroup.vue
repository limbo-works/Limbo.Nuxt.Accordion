<template>
	<Component :is="tag" class="c-accordion-group">
		<slot v-bind="{ hasFocus, method: { openAll, closeAll } }" />
	</Component>
</template>

<script setup>
const _accordionMaps = useAccordionMaps();

const instance = getCurrentInstance();

const props = defineProps({
	tag: {
		type: String,
		default: 'div',
	},
	minOneOpen: {
		type: Boolean,
		default: false,
	},
	maxOneOpen: {
		type: Boolean,
		default: false,
	},
});

provide('accordionGroup', instance);

const headerList = computed(() => {
	const list = [];
	for (const key in _accordionMaps.headers) {
		const header = _accordionMaps.headers[key];
		if (header.accordionGroup === instance) {
			list.push(header);
		}
	}
	return list;
});

const panelList = computed(() => {
	const list = [];
	for (const key in _accordionMaps.panels) {
		const panel = _accordionMaps.panels[key];
		if (panel.accordionGroup === instance) {
			list.push(panel);
		}
	}
	return list;
});

const hasFocus = computed(() => {
	return headerList.value.some((header) => header.hasFocus);
});

watch(panelList, () => {
	checkMinOneOpen();
	checkMaxOneOpen();
});

checkMinOneOpen();
checkMaxOneOpen();

defineExpose({
	openAll,
	closeAll,
});

function openAll() {
	panelList.value.forEach((panel) => panel.open?.());
}

function closeAll() {
	panelList.value.forEach((panel) => panel.close?.());
}

function checkMinOneOpen() {
	if (
		props.minOneOpen &&
		panelList.value.filter((panel) => panel.isOpen).length === 0
	) {
		panelList.value?.[0]?.open?.();
	}
}

function checkMaxOneOpen() {
	if (props.maxOneOpen) {
		const filteredPanelList = panelList.value.filter(
			(panel) => panel.isOpen
		);
		for (let i = 1; i < filteredPanelList.length; i++) {
			panelList.value[i]?.close?.();
		}
	}
}
</script>

<style>
:where(.c-accordion-group) {
	display: block;
}
</style>
