<!--
	Last modified: 2023/07/17 11:46:22
-->
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

<script>
import { reactive } from 'vue';
import { _accordionMaps } from './index.js';


const provide = reactive({
	accordionGroup: null,
	accordionLevel: 0,
});

export default {
	name: 'AccordionPanel',

	inject: {
		accordionGroup: {
			default: null,
		},
		accordionParentPanel: {
			default: null,
		},
		accordionLevel: {
			default: 0,
		},
	},

	provide() {
		return {
			...provide,
			accordionParentPanel: this,
		};
	},

	inheritAttrs: false,

	props: {
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
	},
	emits: ['change', 'change:open', 'change:close'],

	data() {
		return {
			isOpen: this.startOpen,
			openCloseStyles: null,
			readyForTransition: this.transition?.appear,
		};
	},

	computed: {
		nestingLevel() {
			return this.accordionLevel + 1;
		},

		header() {
			if (this.id) {
				for (const key in _accordionMaps.headers) {
					const header = _accordionMaps.headers[key];
					const {
						ariaControls = header?.$options?.propsData?.[
							'aria-controls'
						],
					} = header || {};
					if (ariaControls === this.id) {
						return header;
					}
				}
			}
			return null;
		},

		childPanels() {
			const panels = [];
			for (const key in _accordionMaps.panels) {
				const panel = _accordionMaps.panels[key];
				const { accordionParentPanel } = panel;
				if (accordionParentPanel === this) {
					panels.push(panel);
				}
			}
			return panels;
		},

		transitionProps() {
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
			Object.keys(this.transition || {}).forEach((key) => {
				if (!events.includes(key)) {
					obj[key] = this.transition[key];
				}
			});
			return obj;
		},
		transitionListeners() {
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
			Object.keys(this.transition || {}).forEach((key) => {
				if (events.includes(key)) {
					obj[key] = this.transition[key];
				}
			});
			return obj;
		},

		computedAriaLabel() {
			return (
				this.ariaLabel ||
				(this.computedAriaLabelledby ? null : 'panel') ||
				undefined
			);
		},
		computedAriaLabelledby() {
			const { id: headerId = this.header?.$options?.propsData?.id } =
				this.header || {};
			return (
				this.ariaLabelledby ||
				(this.ariaLabel ? null : headerId) ||
				undefined
			);
		},

		computedOpenByHash() {
			if (typeof this.openByHash === 'boolean' && this.openByHash) {
				return {
					header: true,
					panel: true,
					withinPanel: true,
				};
			}
			return this.openByHash;
		},

		denyClosing() {
			let denyClosing = false;
			if (this.accordionGroup) {
				if (this.accordionGroup.minOneOpen && this.isOpen) {
					if (
						this.accordionGroup.panelList.filter(
							(panel) => panel.isOpen
						).length === 1
					) {
						denyClosing = true;
					}
				}
			}
			return denyClosing;
		},

		emitData() {
			return {
				isOpen: this.isOpen,
				target: this.$el,
				component: this,
			};
		},
	},

	watch: {
		'$route.hash'() {
			this.checkOpenByHash();
		},

		nestingLevel: {
			immediate: true,
			handler(newLevel) {
				provide.accordionLevel = newLevel;
			},
		},
	},

	created() {
		if (typeof window !== 'undefined') {
			_accordionMaps.panels[this.id] = this;
		}
		/* typeof window !== 'undefined' &&
			this.$set(_accordionMaps.panels, this.id, this); */
	},
	mounted() {
		this.checkOpenByHash();

		// This allows it to start open without an initial transition
		this.$nextTick(() => {
			this.readyForTransition = true;
		});
	},
	beforeUnmount() {
		delete _accordionMaps.panels[this.id];
	},
	methods: {
		toggle() {
			this.isOpen ? this.close() : this.open();
		},
		open() {
			if (!this.isOpen) {
				this.isOpen = true;
				this.$emit('change', this.emitData);
				this.$emit('change:open', this.emitData);

				if (this.accordionGroup?.maxOneOpen) {
					this.accordionGroup.panelList.forEach((panel) => {
						panel !== this && panel.close?.();
					});
				}

				if (this.openParentWhenOpened) {
					this.accordionParentPanel?.open?.();
				}
			}
		},
		close() {
			if (this.isOpen && !this.denyClosing) {
				this.isOpen = false;
				this.$emit('change', this.emitData);
				this.$emit('change:close', this.emitData);

				if (this.closeChildrenWhenClosed) {
					this.childPanels.forEach((panel) => {
						panel.close?.();
					});
				}
			}
		},

		checkOpenByHash() {
			const { hash } = this.$route;
			if (hash && this.computedOpenByHash) {
				const {
					header: testHeader,
					panel: testPanel,
					withinPanel: testWithin,
				} = this.computedOpenByHash;
				const { id: headerId = this.header?.$options?.propsData?.id } =
					this.header || {};
				if (
					[testHeader && `#${headerId}`, testPanel && `#${this.id}`]
						.filter(Boolean)
						.includes(hash) ||
					(testWithin && this.$el?.querySelector?.(`${hash}`))
				) {
					this.open();
				}
			}
		},

		// For aiding in transition animations
		setMaxStyles() {
			if (this.transition) {
				const { scrollWidth, scrollHeight } = this.$el;
				let { maxWidth, maxHeight } = window.getComputedStyle(this.$el);

				maxWidth = Number(maxWidth.split('px').shift());
				if (isNaN(maxWidth) || !maxWidth || this.isOpen) {
					maxWidth = scrollWidth;
				}

				maxHeight = Number(maxHeight.split('px').shift());
				if (isNaN(maxHeight) || !maxHeight || this.isOpen) {
					maxHeight = scrollHeight;
				}

				this.openCloseStyles = {
					'--accordion-panel-max-width': `${maxWidth}px`,
					'--accordion-panel-max-height': `${maxHeight}px`,
				};
			}
		},
		unsetMaxStyles() {
			if (this.transition) {
				this.openCloseStyles = null;
			}
		},
	},
};
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
