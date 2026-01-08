<template>
	<div class="nesting-info">
		<strong>Nesting Level:</strong> {{ accordionLevel }}
		<br />
		<small>
			<strong>Parent Panel:</strong> {{ accordionParentPanel ? 'Yes' : 'None' }}
			<br />
			<strong>Accordion Group:</strong> {{ accordionGroup ? 'Present' : 'None' }}
		</small>
	</div>
</template>

<script setup>
const accordionLevel = inject('accordionLevel', 0);
const accordionParentPanel = inject('accordionParentPanel', null);
const accordionGroup = inject('accordionGroup', null);
</script>

<style scoped>
.nesting-info {
	padding: 0.75rem;
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-radius: 4px;
	margin: 0.5rem 0;
	font-size: 0.875rem;
	color: #495057;
}

.nesting-info strong {
	color: #212529;
}

.nesting-info small {
	color: #6c757d;
}
</style>
