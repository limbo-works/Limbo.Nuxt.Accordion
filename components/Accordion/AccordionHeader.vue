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
const { maps: _accordionMaps, cleanup } = useAccordionMaps();

const instance = getCurrentInstance();

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
	for (const key in _accordionMaps.panels) {
		const panel = _accordionMaps.panels[key];
		const panelId = panel?.props?.id;
		if (panelId === props.ariaControls) {
			return panel;
		}
	}
	return null;
});

const ariaExpanded = computed(() =>
	panel.value?.exposed?.isOpen?.value ? 'true' : 'false'
);
const computedAriaDisabled = computed(() =>
	panel.value?.exposed?.denyClosing?.value ? 'true' : props.ariaDisabled
);

if (typeof window !== 'undefined') {
	_accordionMaps.headers[props.id] = instance;
}
onMounted(() => {
	_accordionMaps.headers[props.id] = instance;
});

onBeforeUnmount(() => {
	cleanup('headers', props.id);
	// Additional cleanup to prevent memory leaks
	if (_accordionMaps.value?.instances) {
		_accordionMaps.value.instances.delete(`headers:${props.id}`);
	}
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
		panel.value.exposed.toggle();
	}
}

function keyupHandler(e) {
	props.onKeyup?.(e);
	if (
		!e?.defaultPrevented &&
		accordionGroup &&
		unref(accordionGroup.exposed.headerList).length > 1
	) {
		const headers = unref(accordionGroup.exposed.headerList).map(
			(header) => header.vnode.el
		);

		const index = headers.findIndex((el) => el === e.target);

		if (headers.length > 1) {
			/* eslint-disable */
			switch (e.keyCode) {
				case 36: // HOME
					headers[0].focus();
					e.preventDefault();
					break;
				case 37: // LEFT
					if (index > 0) {
						headers[index - 1].focus();
					}
					e.preventDefault();
					break;
				case 38: // UP
					if (index > 0) {
						headers[index - 1].focus();
					}
					e.preventDefault();
					break;
				case 39: // RIGHT
					if (index < headers.length - 1) {
						headers[index + 1].focus();
					}
					e.preventDefault();
					break;
				case 40: // DOWN
					if (index < headers.length - 1) {
						headers[index + 1].focus();
					}
					e.preventDefault();
					break;
				case 35: // END
					headers[headers.length - 1].focus();
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
		unref(accordionGroup.exposed.headerList).length > 1
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
