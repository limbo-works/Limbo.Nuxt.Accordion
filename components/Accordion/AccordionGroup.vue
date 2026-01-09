<template>
	<Component :is="tag" class="c-accordion-group">
		<slot v-bind="{ hasFocus, method: { openAll, closeAll } }" />
	</Component>
</template>

<script setup>
const { maps: _accordionMaps } = useAccordionMaps();

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

// Cleanup when group is destroyed to prevent memory leaks
onBeforeUnmount(() => {
	const currentGroupUid = groupUid;

	// Clean up all headers belonging to this group
	if (_accordionMaps.value?.headers) {
		Object.keys(_accordionMaps.value.headers).forEach(key => {
			if (_accordionMaps.value.headers[key]?.groupUid === currentGroupUid) {
				delete _accordionMaps.value.headers[key];
				if (_accordionMaps.value?.instances) {
					_accordionMaps.value.instances.delete(`headers:${key}`);
				}
			}
		});
	}

	// Clean up all panels belonging to this group
	if (_accordionMaps.value?.panels) {
		Object.keys(_accordionMaps.value.panels).forEach(key => {
			if (_accordionMaps.value.panels[key]?.groupUid === currentGroupUid) {
				delete _accordionMaps.value.panels[key];
				if (_accordionMaps.value?.instances) {
					_accordionMaps.value.instances.delete(`panels:${key}`);
				}
			}
		});
	}
});

defineExpose({
	minOneOpen: computed(() => props.minOneOpen),
	maxOneOpen: computed(() => props.maxOneOpen),
	openAll,
	closeAll,
	headerList,
	panelList,
});

function openAll() {
	panelList.value.slice().reverse().forEach((panel) => panel.exposed.open?.());
}

function closeAll() {
	panelList.value.slice().reverse().forEach((panel) => panel.exposed.close?.());
}

function checkMinOneOpen() {
	if (
		props.minOneOpen &&
		panelList.value.filter((panel) => panel.exposed.isOpen.value).length === 0
	) {
		panelList.value?.[0]?.exposed.open?.();
	}
}

function checkMaxOneOpen() {
	if (props.maxOneOpen) {
		const filteredPanelList = panelList.value.filter(
			(panel) => panel.exposed.isOpen.value
		);
		for (let i = 1; i < filteredPanelList.length; i++) {
			filteredPanelList[i]?.exposed.close?.();
		}
	}
}
</script>

<style>
:where(.c-accordion-group) {
	display: block;
}
</style>
