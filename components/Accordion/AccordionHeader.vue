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

<script>
const _accordionMaps = useAccordionMaps();

export default {
	name: 'AccordionHeader',

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

	props: {
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
			validate(value) {
				return ['true', 'false'].includes(value);
			},
		},
	},

	data() {
		return {
			hasFocus: false,
		};
	},

	computed: {
		nestingLevel() {
			return this.accordionLevel + 1;
		},

		panel() {
			for (const key in _accordionMaps.panels) {
				const panel = _accordionMaps.panels[key];
				const { id: panelId = panel?.$options?.propsData?.id } = panel;
				if (panelId === this.ariaControls) {
					return panel;
				}
			}
			return null;
		},

		ariaExpanded() {
			return this.panel?.isOpen ? 'true' : 'false';
		},
		computedAriaDisabled() {
			return this.panel?.denyClosing ? 'true' : this.ariaDisabled;
		},
	},

	created() {
		if (typeof window !== 'undefined') {
			_accordionMaps.headers[this.id] = this;
		}
		// &&
		// 	this.$set(_accordionMaps.headers, this.id, this);
	},

	beforeUnmount() {
		delete _accordionMaps.headers[this.id];
	},

	methods: {
		clickHandler(e) {
			if (this.computedAriaDisabled === 'true') {
				e.preventDefault();
				return;
			}

			this.onClick?.(e);
			if (!e?.defaultPrevented) {
				this.panel?.toggle?.();
			}
		},
		keyupHandler(e) {
			this.onKeyup?.(e);
			if (!e?.defaultPrevented && this.accordionGroup) {
				const headers = (this.accordionGroup.headerList || []).map(
					(header) => header.$el
				);
				const index = headers.findIndex((el) => el === e.target);

				if (headers.length > 1) {
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
				}
			}
		},
		keydownHandler(e) {
			this.onKeyup?.(e);
			if (
				!e?.defaultPrevented &&
				this.accordionGroup &&
				this.accordionGroup.headerList.length > 1
			) {
				switch (e.keyCode) {
				case 37: // LEFT
				case 38: // UP
				case 39: // RIGHT
				case 40: // DOWN
				case 36: // HOME
				case 35: // END
					e.preventDefault();
				}
			}
		},

		focusHandler(e) {
			this.onFocus?.(e);
			if (!e?.defaultPrevented) {
				this.hasFocus = true;
			}
		},
		blurHandler(e) {
			this.onFocus?.(e);
			if (!e?.defaultPrevented) {
				this.hasFocus = false;
			}
		},
	},
};
</script>

<style>
:where(.c-accordion-header) {
	display: block;
	text-align: left;
}
</style>
