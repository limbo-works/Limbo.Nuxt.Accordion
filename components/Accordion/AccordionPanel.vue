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
const { maps: _accordionMaps, registerPanel } = useAccordionMaps();

const instance = getCurrentInstance();
const mapId = useId();

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

const isOpen = defineModel({
	type: Boolean,
	default: undefined,
});
isOpen.value ??= props.startOpen;

const openCloseStyles = ref(null);
const readyForTransition = ref(props.transition?.appear);

const nestingLevel = computed(() => myProvide.accordionLevel + 1);

const header = computed(() => {
	if (props.id) {
		for (const key in _accordionMaps.value.headers) {
			const headerData = _accordionMaps.value.headers[key];
			if (headerData?.ariaControls === props.id) {
				return headerData;
			}
		}
	}
	return null;
});
const childPanels = computed(() => {
	const panels = [];
	if (_accordionMaps.value?.panels) {
		for (const key in _accordionMaps.value.panels) {
			const panelData = _accordionMaps.value.panels[key];
			if (panelData?.parentId === mapId) {
				panels.push(panelData);
			}
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
	const headerId = header.value?.id;
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
	if (accordionGroup?.minOneOpen?.value && isOpen.value) {
		// Count open panels in the same group using data lookup
		let openCount = 0;
		if (_accordionMaps.value?.panels) {
			for (const key in _accordionMaps.value.panels) {
				const panelData = _accordionMaps.value.panels[key];
				if (panelData?.groupUid === accordionGroup?.uid && panelData?.isOpen?.value) {
					openCount++;
				}
			}
		}
		if (openCount === 1) {
			denyClosing = true;
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
	registerPanel(mapId, {
		id: props.id,
		groupUid: accordionGroup?.uid,
		parentId: accordionParentPanel?.mapId,
		level: accordionLevel,
		isOpen: isOpen,
		denyClosing: denyClosing,
		methods: {
			open,
			close,
			toggle,
		}
	});
}

let hashFrameRequest;
onMounted(() => {
	registerPanel(mapId, {
		id: props.id,
		groupUid: accordionGroup?.uid,
		parentId: accordionParentPanel?.mapId,
		level: accordionLevel,
		isOpen: isOpen,
		denyClosing: denyClosing,
		methods: {
			open,
			close,
			toggle,
		}
	});

	checkOpenByHash();
	window.addEventListener('hashchange', checkOpenByHash);

	// This allows it to start open without an initial transition
	nextTick(() => {
		readyForTransition.value = true;
	});
});

onBeforeUnmount(() => {
	window.removeEventListener('hashchange', checkOpenByHash);
	if (hashFrameRequest) {
		cancelAnimationFrame(hashFrameRequest);
	}

	const panelData = _accordionMaps.value.panels[mapId];
	panelData?.cleanup?.();
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

		// Check maxOneOpen from accordion group
		if (accordionGroup?.maxOneOpen?.value) {
			// Close other panels in the same group using data lookup
			if (_accordionMaps.value?.panels) {
				for (const key in _accordionMaps.value.panels) {
					const panelData = _accordionMaps.value.panels[key];
					if (panelData && panelData.groupUid === accordionGroup?.uid &&
						panelData.id !== props.id) {
						panelData.methods?.close?.();
					}
				}
			}
		}

		if (props.openParentWhenOpened && accordionParentPanel) {
			// Find parent panel data and call its open method
			const parentPanelData = Object.values(_accordionMaps.value.panels || {})
				.find(p => p.id === accordionParentPanel.mapId);
			parentPanelData?.methods?.open?.();
		}
	}
}

function close() {
	if (isOpen.value && !denyClosing.value) {
		isOpen.value = false;
		emit('change', emitData.value);
		emit('change:close', emitData.value);

		if (props.closeChildrenWhenClosed) {
			childPanels.value?.forEach?.((panelData) => {
				panelData?.methods?.close?.();
			});
		}
	}
}

function checkOpenByHash() {
	cancelAnimationFrame(hashFrameRequest);
	hashFrameRequest = requestAnimationFrame(() => {
		const { hash } = route;

		if (hash && computedOpenByHash.value) {
			const {
				header: testHeader,
				panel: testPanel,
				withinPanel: testWithin,
			} = computedOpenByHash.value;

			const headerId = header.value?.id;

			if (
				[testHeader && `#${headerId}`, testPanel && `#${props.id}`]
					.filter(Boolean)
					.includes(hash) ||
			(testWithin && instance.vnode.el?.querySelector?.(`${hash}`))
			) {
				open();
			}
		}
	});
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
