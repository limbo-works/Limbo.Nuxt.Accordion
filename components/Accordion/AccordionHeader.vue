<template>
	<Component
		:is="tag"
		:id="id"
		class="c-accordion-header"
		:aria-controls="ariaControls"
		:aria-disabled="computedAriaDisabled"
		:aria-expanded="ariaExpanded"
		@click="clickHandler"
		@keyup="keyupHandler"
		@keydown="keydownHandler"
		@focus="focusHandler"
		@blur="blurHandler"
	>
		<slot></slot>
	</Component>
</template>

<script setup>
const { maps: _accordionMaps, registerHeader } = useAccordionMaps();

const instance = getCurrentInstance();
const mapId = useId();

const props = defineProps({
	tag: {
		type: String,
		default: 'button',
	},
	id: {
		type: String,
		required: true,
	},
	ariaControls: {
		type: String,
		required: true,
	},
	ariaDisabled: {
		type: String,
		default: 'false',
		validator(value) {
			return ['true', 'false'].includes(value);
		},
	},
	// Events
	onFocus: Function,
	onKeydown: Function,
	onKeyup: Function,
});

const accordionGroup = inject('accordionGroup', null);
const accordionParentPanel = inject('accordionParentPanel', null);
const accordionLevel = inject('accordionLevel', 0);

const hasFocus = ref(false);

const nestingLevel = computed(() => accordionLevel.value + 1);

const panel = computed(() => {
	for (const key in _accordionMaps.value.panels) {
		const panelData = _accordionMaps.value.panels[key];
		if (panelData?.id === props.ariaControls) {
			return panelData;
		}
	}
	return null;
});

const ariaExpanded = computed(() =>
	panel.value?.isOpen ? 'true' : 'false'
);
const computedAriaDisabled = computed(() =>
	panel.value?.denyClosing ? 'true' : props.ariaDisabled
);

if (typeof window !== 'undefined') {
	registerHeader(mapId, {
		id: props.id,
		ariaControls: props.ariaControls,
		groupUid: accordionGroup?.uid,
		parentId: accordionParentPanel?.mapId,
		level: accordionLevel,
		hasFocus: hasFocus,
		nestingLevel: nestingLevel,
		methods: {
			focus: () => instance?.refs?.button?.focus?.(),
			click: clickHandler,
		}
	});
}

onMounted(() => {
	registerHeader(mapId, {
		id: props.id,
		ariaControls: props.ariaControls,
		groupUid: accordionGroup?.uid,
		parentId: accordionParentPanel?.mapId,
		level: accordionLevel,
		hasFocus: hasFocus,
		nestingLevel: nestingLevel,
		methods: {
			focus: () => instance?.refs?.button?.focus?.(),
			click: clickHandler,
		}
	});
});

onBeforeUnmount(() => {
	const headerData = _accordionMaps.value.headers[mapId];
	headerData?.cleanup?.();
});

defineExpose({
	hasFocus,
	nestingLevel,
	// Injected
	accordionGroup,
	accordionParentPanel,
	accordionLevel,
});

function clickHandler(e) {
	if (computedAriaDisabled.value === 'true') {
		e.preventDefault();
		return;
	}

	if (panel.value) {
		panel.value.methods?.toggle?.();
	}
}

function keyupHandler(e) {
	props.onKeyup?.(e);
	if (
		!e?.defaultPrevented &&
		accordionGroup &&
		accordionGroup.headerList?.value?.length > 1
	) {
		// Get headers from the maps instead
		const headers = [];
		for (const key in _accordionMaps.value.headers) {
			const headerData = _accordionMaps.value.headers[key];
			if (headerData?.groupUid === accordionGroup?.uid) {
				headers.push(headerData);
			}
		}

		const headerElements = headers.map((headerData) => {
			// Find the DOM element for each header
			return document.getElementById(headerData.id);
		}).filter(Boolean);

		const index = headerElements.findIndex((el) => el === e.target);

		if (headerElements.length > 1) {
			/* eslint-disable */
			switch (e.keyCode) {
				case 36: // HOME
					headerElements[0].focus();
					e.preventDefault();
					break;
				case 37: // LEFT
					if (index > 0) {
						headerElements[index - 1].focus();
					}
					e.preventDefault();
					break;
				case 38: // UP
					if (index > 0) {
						headerElements[index - 1].focus();
					}
					e.preventDefault();
					break;
				case 39: // RIGHT
					if (index < headerElements.length - 1) {
						headerElements[index + 1].focus();
					}
					e.preventDefault();
					break;
				case 40: // DOWN
					if (index < headerElements.length - 1) {
						headerElements[index + 1].focus();
					}
					e.preventDefault();
					break;
				case 35: // END
					headerElements[headerElements.length - 1].focus();
					e.preventDefault();
					break;
			}
			/* eslint-enable */
		}
	}
}

function keydownHandler(e) {
	props.onKeydown?.(e);
	if (
		!e?.defaultPrevented &&
		accordionGroup &&
		accordionGroup.headerList?.value?.length > 1
	) {
		/* eslint-disable */
		switch (e.keyCode) {
			case 37: // LEFT
			case 38: // UP
			case 39: // RIGHT
			case 40: // DOWN
			case 36: // HOME
			case 35: // END
				e.preventDefault();
		}
		/* eslint-enable */
	}
}

function focusHandler(e) {
	props.onFocus?.(e);
	if (!e?.defaultPrevented) {
		hasFocus.value = true;
	}
}

function blurHandler(e) {
	props.onFocus?.(e);
	if (!e?.defaultPrevented) {
		hasFocus.value = false;
	}
}
</script>

<style>
:where(.c-accordion-header) {
	display: block;
	text-align: left;
}
</style>
