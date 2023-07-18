import { test, expect } from 'vitest';

import AccordionGroup from '../components/Accordion/AccordionGroup.vue';
import AccordionHeader from '../components/Accordion/AccordionHeader.vue';
import AccordionPanel from '../components/Accordion/AccordionPanel.vue';

test('mount AccordionGroup component', async () => {
	expect(AccordionGroup).toBeTruthy();
});
test('mount AccordionHeader component', async () => {
	expect(AccordionHeader).toBeTruthy();
});
test('mount AccordionPanel component', async () => {
	expect(AccordionPanel).toBeTruthy();
});
