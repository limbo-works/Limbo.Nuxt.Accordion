// Last modified: 2022/10/03 14:52:12
//import Vue from 'vue';
import { reactive } from 'vue';
import AccordionGroup from './AccordionGroup.vue';
import AccordionHeader from './AccordionHeader.vue';
import AccordionPanel from './AccordionPanel.vue';

const _accordionMaps = reactive({
	headers: {},
	panels: {},
});

export { AccordionGroup, AccordionHeader, AccordionPanel, _accordionMaps };
