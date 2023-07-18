<template>
	<AccordionGroup>
		<template v-for="(item, index) in 9" :key="`header-${index}`">
			<AccordionHeader :id="`${index}`" :aria-controls="`panel-${index}`">
				header {{ item }}
			</AccordionHeader>

			<AccordionPanel :id="`panel-${index}`">
				tekst {{ item }}
			</AccordionPanel>
		</template>
	</AccordionGroup>
</template>
