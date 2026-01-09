<template>
	<Component :is="tag" class="c-accordion-group">
		<slot v-bind="{ hasFocus, method: { openAll, closeAll } }" />
	</Component>
</template>

<script setup>
const { maps: _accordionMaps } = useAccordionMaps();

const instance = getCurrentInstance();
const groupUid = useId();

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

provide('accordionGroup', { uid: groupUid, minOneOpen: computed(() => props.minOneOpen), maxOneOpen: computed(() => props.maxOneOpen) });

const headerList = computed(() => {
	const list = [];
	for (const key in _accordionMaps.value.headers) {
		const headerData = _accordionMaps.value.headers[key];
		if (headerData?.groupUid === groupUid) {
			list.push(headerData);
		}
	}
	return list;
});

const panelList = computed(() => {
	const list = [];
	for (const key in _accordionMaps.value.panels) {
		const panelData = _accordionMaps.value.panels[key];
		if (panelData?.groupUid === groupUid) {
			list.push(panelData);
		}
	}
	return list;
});

const hasFocus = computed(() => {
	return headerList.value.some((headerData) => headerData.hasFocus?.value);
});

watch(panelList, () => {
	checkMinOneOpen();
	checkMaxOneOpen();
});

// Also watch for changes in panel open states
watch(() => panelList.value.map(p => p.isOpen?.value), () => {
	checkMinOneOpen();
	checkMaxOneOpen();
}, { deep: true });

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
	panelList.value.slice().reverse().forEach((panelData) => panelData.methods?.open?.());
}

function closeAll() {
	panelList.value.slice().reverse().forEach((panelData) => panelData.methods?.close?.());
}

function checkMinOneOpen() {
	if (
		props.minOneOpen &&
		panelList.value.filter((panelData) => panelData.isOpen?.value).length === 0
	) {
		panelList.value?.[0]?.methods?.open?.();
	}
}

function checkMaxOneOpen() {
	if (props.maxOneOpen) {
		const filteredPanelList = panelList.value.filter(
			(panelData) => panelData.isOpen?.value
		);
		for (let i = 1; i < filteredPanelList.length; i++) {
			filteredPanelList[i]?.methods?.close?.();
		}
	}
}
</script>

<style>
:where(.c-accordion-group) {
	display: block;
}
</style>
