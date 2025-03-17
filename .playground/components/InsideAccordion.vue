<template>
	<div>{{ accordionLevel }}</div>
</template>

<script setup>
const accordionLevel = inject('accordionLevel', 0);
</script>
