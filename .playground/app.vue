<template>
	<AccordionGroup>
		<template v-for="(item, index) in 9" :key="`header-${index}`">
			<AccordionHeader :id="`header-${index}`" :aria-controls="`panel-${index}`">
				header {{ item }}
			</AccordionHeader>

			<AccordionPanel :id="`panel-${index}`">
				tekst {{ item }}
				<InsideAccordion />
			</AccordionPanel>
		</template>

		<AccordionHeader :id="`header`" :aria-controls="`panel`">
			header
		</AccordionHeader>

		<AccordionPanel :id="`panel`" v-model="valueTest">
			tekst
			<InsideAccordion />
		</AccordionPanel>
	</AccordionGroup>
</template>

<script setup>
const valueTest = ref(false);

watch(valueTest, (val) => {
	console.log('valueTest', val);
});
</script>
