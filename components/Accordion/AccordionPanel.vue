<template>
	<Transition
		v-bind="transitionProps"
		:name="transition && readyForTransition ? transition.name : null"
		:css="transition ? transition.css : false"
		v-on="transitionListeners"
		@enter="setMaxStyles"
		@enter-cancelled="unsetMaxStyles"
		@after-enter="unsetMaxStyles"
		@leave="setMaxStyles"
		@leave-cancelled="unsetMaxStyles"
		@after-leave="unsetMaxStyles"
	>
		<Component
			:is="tag"
			v-show="isOpen"
			:id="id"
			key="panel"
			role="region"
			class="c-accordion-panel"
			:style="openCloseStyles"
			:aria-label="computedAriaLabel"
			:aria-labelledby="computedAriaLabelledby"
			v-bind="$attrs"
		>
			<slot></slot>
		</Component>
	</Transition>
</template>

<script setup>
const _accordionMaps = useAccordionMaps();

const instance = getCurrentInstance();

const route = useRoute();

const emit = defineEmits(['change', 'change:open', 'change:close']);
const props = defineProps({
	tag: {
		type: String,
		default: 'div',
	},
	transition: {
		type: Object,
		default: null,
	},
	id: {
		type: String,
		required: true,
	},

	ariaLabel: {
		type: String,
		default: undefined,
	},
	ariaLabelledby: {
		type: String,
		default: undefined,
	},

	startOpen: {
		type: Boolean,
		default: false,
	},
	openByHash: {
		type: [Boolean, Object],
		default: () => ({
			header: true,
			panel: false,
			withinPanel: false,
		}),
	},
	openParentWhenOpened: {
		type: Boolean,
		default: true,
	},
	closeChildrenWhenClosed: {
		type: Boolean,
		default: true,
	},
});

const accordionGroup = inject('accordionGroup', null);
const accordionParentPanel = inject('accordionParentPanel', null);
const accordionLevel = inject('accordionLevel', 0);

const myProvide = reactive({
	accordionGroup: null,
	accordionLevel: accordionLevel + 1,
});

provide('accordionGroup', myProvide.accordionGroup);
provide('accordionLevel', myProvide.accordionLevel);
provide('accordionParentPanel', instance);

const isOpen = ref(props.startOpen);
const openCloseStyles = ref(null);
const readyForTransition = ref(props.transition?.appear);

const nestingLevel = computed(() => myProvide.accordionLevel + 1);

const header = computed(() => {
	if (props.id) {
		for (const key in _accordionMaps.headers) {
			const header = _accordionMaps.headers[key];
			const { ariaControls = header?.props?.ariaControls } = header || {};

			if (ariaControls === props.id) {
				return header;
			}
		}
	}

	return null;
});
const childPanels = computed(() => {
	const panels = [];
	for (const key in _accordionMaps.panels) {
		const panel = _accordionMaps.panels[key];
		const { accordionParentPanel } = panel.exposed;
		if (accordionParentPanel === instance) {
			panels.push(panel);
		}
	}
	return panels;
});

const transitionProps = computed(() => {
	const obj = {};
	const events = [
		'beforeEnter',
		'enter',
		'afterEnter',
		'enterCancelled',
		'beforeLeave',
		'leave',
		'afterLeave',
		'leaveCancelled',
	];
	Object.keys(props.transition || {}).forEach((key) => {
		if (!events.includes(key)) {
			obj[key] = props.transition[key];
		}
	});
	return obj;
});

const transitionListeners = computed(() => {
	const obj = {};
	const events = [
		'beforeEnter',
		'enter',
		'afterEnter',
		'enterCancelled',
		'beforeLeave',
		'leave',
		'afterLeave',
		'leaveCancelled',
	];
	Object.keys(props.transition || {}).forEach((key) => {
		if (events.includes(key)) {
			obj[key] = props.transition[key];
		}
	});
	return obj;
});

const computedAriaLabel = computed(() => {
	return props.ariaLabel || (header?.ariaLabel ? null : 'panel') || undefined;
});

const computedAriaLabelledby = computed(() => {
	const { id: headerId = header?.$options?.propsData?.id } = header || {};
	return (
		props.ariaLabelledby || (props.ariaLabel ? null : headerId) || undefined
	);
});

const computedOpenByHash = computed(() => {
	if (typeof props.openByHash === 'boolean' && props.openByHash) {
		return {
			header: true,
			panel: true,
			withinPanel: true,
		};
	}
	return props.openByHash;
});

const denyClosing = computed(() => {
	let denyClosing = false;
	if (accordionGroup) {
		if (accordionGroup.exposed.minOneOpen && isOpen.value) {
			if (
				accordionGroup.exposed.panelList.filter(
					(panel) => panel.exposed.isOpen
				).length === 1
			) {
				denyClosing = true;
			}
		}
	}
	return denyClosing;
});

const emitData = computed(() => {
	return {
		isOpen: isOpen.value,
		target: instance.vnode.el,
		component: instance,
	};
});

watch(
	() => route.hash,
	() => {
		checkOpenByHash();
	}
);

watch(nestingLevel, () => {
	myProvide.accordionLevel = nestingLevel.value;
});

if (typeof window !== 'undefined') {
	_accordionMaps.panels[props.id] = instance;
}
onMounted(() => {
	_accordionMaps.panels[props.id] = instance;

	checkOpenByHash();

	// This allows it to start open without an initial transition
	nextTick(() => {
		readyForTransition.value = true;
	});
});

onBeforeUnmount(() => {
	delete _accordionMaps.panels[props.id];
});

defineExpose({
	isOpen,
	open,
	close,
	toggle,
	denyClosing,

	// Injected
	accordionGroup,
	accordionParentPanel,
	accordionLevel,
});

function toggle() {
	isOpen.value ? close() : open();
}

function open() {
	if (!isOpen.value) {
		isOpen.value = true;
		emit('change', emitData.value);
		emit('change:open', emitData.value);

		if (accordionGroup?.exposed?.maxOneOpen) {
			accordionGroup.exposed.panelList.value.forEach((panel) => {
				panel.uid !== instance.uid && panel.exposed.close?.();
			});
		}

		if (props.openParentWhenOpened) {
			accordionParentPanel?.open?.();
		}
	}
}

function close() {
	if (isOpen.value && !denyClosing.value) {
		isOpen.value = false;
		emit('change', emitData.value);
		emit('change:close', emitData.value);

		if (props.closeChildrenWhenClosed) {
			childPanels.value.forEach((panel) => {
				panel.exposed.close?.();
			});
		}
	}
}

function checkOpenByHash() {
	const { hash } = route;

	if (hash && computedOpenByHash.value) {
		const {
			header: testHeader,
			panel: testPanel,
			withinPanel: testWithin,
		} = computedOpenByHash.value;

		const { id: headerId = header?.value?.props?.id } = header.value || {};

		if (
			[testHeader && `#${headerId}`, testPanel && `#${props.id}`]
				.filter(Boolean)
				.includes(hash) ||
			(testWithin && instance.vnode.el?.querySelector?.(`${hash}`))
		) {
			open();
		}
	}
}

function setMaxStyles() {
	if (props.transition) {
		const { scrollWidth, scrollHeight } = instance.vnode.el;
		let { maxWidth, maxHeight } = window.getComputedStyle(
			instance.vnode.el
		);

		maxWidth = Number(maxWidth.split('px').shift());
		if (isNaN(maxWidth) || !maxWidth || isOpen.value) {
			maxWidth = scrollWidth;
		}

		maxHeight = Number(maxHeight.split('px').shift());
		if (isNaN(maxHeight) || !maxHeight || isOpen.value) {
			maxHeight = scrollHeight;
		}

		openCloseStyles.value = {
			'--accordion-panel-max-width': `${maxWidth}px`,
			'--accordion-panel-max-height': `${maxHeight}px`,
		};
	}
}

function unsetMaxStyles() {
	if (props.transition) {
		openCloseStyles.value = null;
	}
}
</script>

<style>
:where(.c-accordion-panel) {
	--accordion-panel-max-width: none;
	--accordion-panel-max-height: none;

	max-width: var(--accordion-panel-max-width, none);
	max-height: var(--accordion-panel-max-height, none);
	overflow: hidden;
	overflow: clip;
}
</style>
