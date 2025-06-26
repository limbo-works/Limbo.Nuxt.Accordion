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
		if (header.exposed?.accordionGroup?.uid === instance?.uid) {
			list.push(header);
		}
	}
	return list;
});

const panelList = computed(() => {
	const list = [];
	for (const key in _accordionMaps.panels) {
		const panel = _accordionMaps.panels[key];
		if (panel.exposed.accordionGroup === instance) {
			list.push(panel);
		}
	}
	return list;
});

const hasFocus = computed(() => {
	return headerList.value.some((header) => header.exposed.hasFocus);
});

watch(panelList, () => {
	checkMinOneOpen();
	checkMaxOneOpen();
});

checkMinOneOpen();
checkMaxOneOpen();

defineExpose({
	minOneOpen: props.minOneOpen,
	maxOneOpen: props.maxOneOpen,
	openAll,
	closeAll,
	headerList,
	panelList,
});

function openAll() {
	panelList.value.forEach((panel) => panel.exposed.open?.());
}

function closeAll() {
	panelList.value.forEach((panel) => panel.exposed.close?.());
}

function checkMinOneOpen() {
	if (
		props.minOneOpen &&
		panelList.value.filter((panel) => panel.exposed.isOpen).length === 0
	) {
		panelList.value?.[0]?.open?.();
	}
}

function checkMaxOneOpen() {
	if (props.maxOneOpen) {
		const filteredPanelList = panelList.value.filter(
			(panel) => panel.exposed.isOpen
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
