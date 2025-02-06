<template>
	<Component :is="tag" class="c-accordion-group">
		<slot v-bind="{ hasFocus, method: { openAll, closeAll } }" />
	</Component>
</template>

<script>
const _accordionMaps = useAccordionMaps();

export default {
	name: 'AccordionGroup',

	provide() {
		return {
			accordionGroup: this,
		};
	},

	props: {
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
	},

	computed: {
		headerList() {
			const list = [];
			for (const key in _accordionMaps.headers) {
				const header = _accordionMaps.headers[key];
				if (header.accordionGroup === this) {
					list.push(header);
				}
			}
			return list;
		},
		panelList() {
			const list = [];
			for (const key in _accordionMaps.panels) {
				const panel = _accordionMaps.panels[key];
				if (panel.accordionGroup === this) {
					list.push(panel);
				}
			}
			return list;
		},

		hasFocus() {
			return this.headerList.some((header) => header.hasFocus);
		},
	},

	watch: {
		panelList() {
			this.checkMinOneOpen();
			this.checkMaxOneOpen();
		},
	},

	created() {
		this.checkMinOneOpen();
		this.checkMaxOneOpen();
	},

	methods: {
		openAll() {
			this.panelList.forEach((panel) => panel.open?.());
		},
		closeAll() {
			this.panelList.forEach((panel) => panel.close?.());
		},

		checkMinOneOpen() {
			if (
				this.minOneOpen &&
				this.panelList.filter((panel) => panel.isOpen).length === 0
			) {
				this.panelList?.[0]?.open?.();
			}
		},
		checkMaxOneOpen() {
			if (this.maxOneOpen) {
				const filteredPanelList = this.panelList.filter(
					(panel) => panel.isOpen
				);
				for (let i = 1; i < filteredPanelList.length; i++) {
					this.panelList[i]?.close?.();
				}
			}
		},
	},
};
</script>

<style>
:where(.c-accordion-group) {
	display: block;
}
</style>
