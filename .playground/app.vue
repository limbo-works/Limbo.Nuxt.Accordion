<template>
	<div class="playground">
		<h1>Limbo Nuxt Accordion Playground</h1>
		<nav>
			<a href="#basic">Basic Usage</a>
			<a href="#controlled">Controlled Behavior</a>
			<a href="#nested">Nested Accordions</a>
			<a href="#transitions">Transitions</a>
			<a href="#hash-navigation">Hash Navigation</a>
			<a href="#accessibility">Accessibility</a>
			<a href="#custom-elements">Custom Elements</a>
			<a href="#events">Events & v-model</a>
		</nav>

		<!-- Basic Usage -->
		<section id="basic" class="example-section">
			<h2>Basic Usage</h2>
			<p>Simple accordion with multiple panels</p>
			<AccordionGroup>
				<AccordionHeader id="basic-header-1" aria-controls="basic-panel-1">
					🚀 What is this accordion?
				</AccordionHeader>
				<AccordionPanel id="basic-panel-1">
					<p>This is a flexible, accessible accordion component for Nuxt applications. It supports keyboard navigation, screen readers, and follows ARIA best practices.</p>
				</AccordionPanel>

				<AccordionHeader id="basic-header-2" aria-controls="basic-panel-2">
					⚡ Features
				</AccordionHeader>
				<AccordionPanel id="basic-panel-2">
					<ul>
						<li>Full keyboard navigation (Arrow keys, Home, End)</li>
						<li>ARIA compliant accessibility</li>
						<li>Nested accordion support</li>
						<li>Hash-based URL navigation</li>
						<li>Customizable transitions</li>
						<li>v-model support</li>
					</ul>
				</AccordionPanel>

				<AccordionHeader id="basic-header-3" aria-controls="basic-panel-3">
					📚 Installation
				</AccordionHeader>
				<AccordionPanel id="basic-panel-3">
					<code>npm install @limbo-works/nuxt-accordion</code>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Controlled Behavior -->
		<section id="controlled" class="example-section">
			<h2>Controlled Behavior</h2>

			<div class="demo-controls">
				<button @click="openAll">Open All</button>
				<button @click="closeAll">Close All</button>
			</div>

			<h3>Min One Open ({{ minOneOpenEnabled ? 'Enabled' : 'Disabled' }})</h3>
			<button @click="minOneOpenEnabled = !minOneOpenEnabled" class="toggle-btn">
				Toggle Min One Open
			</button>
			<AccordionGroup
				:min-one-open="minOneOpenEnabled"
				ref="minOneAccordion"
			>
				<template v-slot="{ method }" ref="minOneAccordionRef">
					<AccordionHeader id="min-header-1" aria-controls="min-panel-1">
						🔒 Panel 1 (Try to close all when min-one-open is enabled)
					</AccordionHeader>
					<AccordionPanel id="min-panel-1" start-open>
						<p>This panel will remain open when min-one-open is enabled and it's the last open panel.</p>
					</AccordionPanel>

					<AccordionHeader id="min-header-2" aria-controls="min-panel-2">
						📝 Panel 2
					</AccordionHeader>
					<AccordionPanel id="min-panel-2">
						<p>This is the second panel content.</p>
					</AccordionPanel>
				</template>
			</AccordionGroup>

			<h3>Max One Open ({{ maxOneOpenEnabled ? 'Enabled' : 'Disabled' }})</h3>
			<button @click="maxOneOpenEnabled = !maxOneOpenEnabled" class="toggle-btn">
				Toggle Max One Open
			</button>
			<AccordionGroup
				:max-one-open="maxOneOpenEnabled"
				ref="maxOneAccordion"
			>
				<AccordionHeader id="max-header-1" aria-controls="max-panel-1">
					🎯 Panel A (Opening this closes others when max-one-open is enabled)
				</AccordionHeader>
				<AccordionPanel id="max-panel-1">
					<p>Only one panel can be open at a time when max-one-open is enabled.</p>
				</AccordionPanel>

				<AccordionHeader id="max-header-2" aria-controls="max-panel-2">
					🎮 Panel B
				</AccordionHeader>
				<AccordionPanel id="max-panel-2">
					<p>Try opening this while Panel A is open.</p>
				</AccordionPanel>

				<AccordionHeader id="max-header-3" aria-controls="max-panel-3">
					🎨 Panel C
				</AccordionHeader>
				<AccordionPanel id="max-panel-3">
					<p>And this one too!</p>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Nested Accordions -->
		<section id="nested" class="example-section">
			<h2>Nested Accordions</h2>
			<p>Accordions can be nested inside other accordions with proper level tracking</p>

			<AccordionGroup>
				<AccordionHeader id="nest-parent-1" aria-controls="nest-panel-1">
					📁 Parent Level 1
				</AccordionHeader>
				<AccordionPanel id="nest-panel-1">
					<p>This is level 1 content. <InsideAccordion /></p>

					<AccordionGroup>
						<AccordionHeader id="nest-child-1" aria-controls="nest-child-panel-1">
							📂 Child Level 2
						</AccordionHeader>
						<AccordionPanel id="nest-child-panel-1">
							<p>This is level 2 content. <InsideAccordion /></p>

							<AccordionGroup>
								<AccordionHeader id="nest-grandchild-1" aria-controls="nest-grandchild-panel-1">
									📄 Grandchild Level 3
								</AccordionHeader>
								<AccordionPanel id="nest-grandchild-panel-1">
									<p>This is level 3 content. <InsideAccordion /></p>
								</AccordionPanel>
							</AccordionGroup>
						</AccordionPanel>

						<AccordionHeader id="nest-child-2" aria-controls="nest-child-panel-2">
							🗃️ Another Child Level 2
						</AccordionHeader>
						<AccordionPanel id="nest-child-panel-2">
							<p>This is another level 2 panel. <InsideAccordion /></p>
						</AccordionPanel>
					</AccordionGroup>
				</AccordionPanel>

				<AccordionHeader id="nest-parent-2" aria-controls="nest-panel-2">
					📁 Another Parent Level 1
				</AccordionHeader>
				<AccordionPanel id="nest-panel-2">
					<p>This is another level 1 content. <InsideAccordion /></p>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Transitions -->
		<section id="transitions" class="example-section">
			<h2>Transitions</h2>
			<p>Custom animations and transitions for panel open/close</p>

			<AccordionGroup>
				<AccordionHeader id="trans-header-1" aria-controls="trans-panel-1">
					✨ Slide Transition
				</AccordionHeader>
				<AccordionPanel
					id="trans-panel-1"
					:transition="slideTransition"
				>
					<p>This panel slides in and out smoothly with a custom transition.</p>
					<div class="demo-content">
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					</div>
				</AccordionPanel>

				<AccordionHeader id="trans-header-2" aria-controls="trans-panel-2">
					🎭 Fade Transition
				</AccordionHeader>
				<AccordionPanel
					id="trans-panel-2"
					:transition="fadeTransition"
				>
					<p>This panel fades in and out with opacity changes.</p>
					<div class="demo-content">
						<img src="https://via.placeholder.com/300x200" alt="Demo image" />
					</div>
				</AccordionPanel>

				<AccordionHeader id="trans-header-3" aria-controls="trans-panel-3">
					🚀 No Transition
				</AccordionHeader>
				<AccordionPanel id="trans-panel-3">
					<p>This panel opens and closes instantly without any transition.</p>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Hash Navigation -->
		<section id="hash-navigation" class="example-section">
			<h2>Hash Navigation</h2>
			<p>URL hash-based navigation to open specific panels</p>

			<div class="hash-links">
				<a href="#hash-panel-1">Open Panel 1</a>
				<a href="#hash-header-2">Open Panel 2 (via header)</a>
				<a href="#hash-panel-3">Open Panel 3</a>
				<a href="#nested-target">Open Panel 4 (nested target)</a>
			</div>

			<AccordionGroup>
				<AccordionHeader id="hash-header-1" aria-controls="hash-panel-1">
					🔗 Panel 1 (opens via #hash-panel-1)
				</AccordionHeader>
				<AccordionPanel
					id="hash-panel-1"
					:open-by-hash="{ header: false, panel: true, withinPanel: false }"
				>
					<p>This panel opens when you navigate to #hash-panel-1</p>
				</AccordionPanel>

				<AccordionHeader id="hash-header-2" aria-controls="hash-panel-2">
					🎯 Panel 2 (opens via #hash-header-2)
				</AccordionHeader>
				<AccordionPanel
					id="hash-panel-2"
					:open-by-hash="{ header: true, panel: false, withinPanel: false }"
				>
					<p>This panel opens when you navigate to the header ID #hash-header-2</p>
				</AccordionPanel>

				<AccordionHeader id="hash-header-3" aria-controls="hash-panel-3">
					📍 Panel 3 (opens via #hash-panel-3)
				</AccordionHeader>
				<AccordionPanel id="hash-panel-3">
					<p>This panel opens when you navigate to #hash-panel-3</p>
				</AccordionPanel>

				<AccordionHeader id="hash-header-4" aria-controls="hash-panel-4">
					🎪 Panel 4 (opens via nested element #nested-target)
				</AccordionHeader>
				<AccordionPanel
					id="hash-panel-4"
					:open-by-hash="{ header: false, panel: false, withinPanel: true }"
				>
					<p>This panel opens when you navigate to an element inside it:</p>
					<div id="nested-target" class="highlight-target">
						🎯 This is the nested target element!
					</div>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Accessibility -->
		<section id="accessibility" class="example-section">
			<h2>Accessibility Features</h2>
			<p>ARIA compliant with keyboard navigation and screen reader support</p>

			<div class="accessibility-info">
				<h3>Keyboard Controls:</h3>
				<ul>
					<li><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> - Navigate between accordion headers</li>
					<li><kbd>Space</kbd> / <kbd>Enter</kbd> - Toggle panel open/closed</li>
					<li><kbd>Home</kbd> - Focus first header</li>
					<li><kbd>End</kbd> - Focus last header</li>
					<li><kbd>↑</kbd> / <kbd>↓</kbd> - Navigate between headers</li>
					<li><kbd>←</kbd> / <kbd>→</kbd> - Navigate between headers</li>
				</ul>
			</div>

			<AccordionGroup>
				<AccordionHeader
					id="a11y-header-1"
					aria-controls="a11y-panel-1"
					:on-focus="onHeaderFocus"
				>
					♿ Accessible Panel 1 (Focus tracking: {{ focusedHeader }})
				</AccordionHeader>
				<AccordionPanel
					id="a11y-panel-1"
					aria-label="Custom panel label for screen readers"
				>
					<p>This panel has a custom aria-label for screen readers and tracks focus events.</p>
				</AccordionPanel>

				<AccordionHeader
					id="a11y-header-2"
					aria-controls="a11y-panel-2"
					aria-disabled="false"
				>
					🔓 Enabled Panel 2
				</AccordionHeader>
				<AccordionPanel id="a11y-panel-2">
					<p>This panel is always enabled and can be opened/closed freely.</p>
				</AccordionPanel>

				<AccordionHeader
					id="a11y-header-3"
					aria-controls="a11y-panel-3"
					aria-disabled="true"
				>
					🔒 Disabled Panel 3
				</AccordionHeader>
				<AccordionPanel id="a11y-panel-3">
					<p>This panel is disabled and cannot be opened.</p>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Custom Elements -->
		<section id="custom-elements" class="example-section">
			<h2>Custom HTML Elements</h2>
			<p>Use different HTML elements for headers and panels</p>

			<AccordionGroup tag="section">
				<AccordionHeader
					id="custom-header-1"
					aria-controls="custom-panel-1"
					tag="h3"
				>
					📝 H3 Header Element
				</AccordionHeader>
				<AccordionPanel id="custom-panel-1" tag="article">
					<p>This accordion uses a &lt;section&gt; as the group, &lt;h3&gt; as the header, and &lt;article&gt; as the panel.</p>
				</AccordionPanel>

				<AccordionHeader
					id="custom-header-2"
					aria-controls="custom-panel-2"
					tag="summary"
				>
					🏷️ Summary Element
				</AccordionHeader>
				<AccordionPanel id="custom-panel-2" tag="details">
					<p>This uses &lt;summary&gt; and &lt;details&gt; elements for semantic HTML.</p>
				</AccordionPanel>
			</AccordionGroup>
		</section>

		<!-- Events & v-model -->
		<section id="events" class="example-section">
			<h2>Events & v-model Support</h2>
			<p>Track panel state changes and control panels programmatically</p>

			<div class="event-log">
				<h3>Event Log:</h3>
				<div class="log-container" ref="eventLog">
					<div v-for="event in eventHistory" :key="event.id" class="log-entry">
						<span class="timestamp">{{ event.timestamp }}</span>
						<span class="event-type">{{ event.type }}</span>
						<span class="event-data">{{ event.data }}</span>
					</div>
				</div>
				<button @click="clearEventLog" class="clear-btn">Clear Log</button>
			</div>

			<div class="model-controls">
				<p>Panel 1 State: <strong>{{ panel1Open ? 'Open' : 'Closed' }}</strong></p>
				<button @click="panel1Open = !panel1Open" class="toggle-btn">
					Toggle Panel 1 via v-model
				</button>
			</div>

			<AccordionGroup>
				<AccordionHeader id="event-header-1" aria-controls="event-panel-1">
					🎮 Panel 1 (v-model controlled: {{ panel1Open ? 'Open' : 'Closed' }})
				</AccordionHeader>
				<AccordionPanel
					id="event-panel-1"
					v-model="panel1Open"
					@change="onPanelChange"
					@change:open="onPanelOpen"
					@change:close="onPanelClose"
				>
					<p>This panel's state is controlled via v-model and emits events when changed.</p>
					<p>Current state: {{ panel1Open ? 'Open' : 'Closed' }}</p>
				</AccordionPanel>

				<AccordionHeader id="event-header-2" aria-controls="event-panel-2">
					📊 Panel 2 (Event tracking only)
				</AccordionHeader>
				<AccordionPanel
					id="event-panel-2"
					@change="onPanelChange"
					@change:open="onPanelOpen"
					@change:close="onPanelClose"
					start-open
				>
					<p>This panel starts open and only tracks events (no v-model binding).</p>
				</AccordionPanel>
			</AccordionGroup>
		</section>
	</div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue';

// Reactive state
const minOneOpenEnabled = ref(true);
const maxOneOpenEnabled = ref(true);
const panel1Open = ref(true);
const focusedHeader = ref('');
const eventHistory = ref([]);
const eventLog = ref(null);

// Accordion refs
const minOneAccordion = ref(null);
const maxOneAccordion = ref(null);

// Transition configurations
const slideTransition = {
	name: 'slide',
	enterFromClass: 'slide-enter-from',
	enterActiveClass: 'slide-enter-active',
	enterToClass: 'slide-enter-to',
	leaveFromClass: 'slide-leave-from',
	leaveActiveClass: 'slide-leave-active',
	leaveToClass: 'slide-leave-to'
};

const fadeTransition = {
	name: 'fade',
	enterFromClass: 'fade-enter-from',
	enterActiveClass: 'fade-enter-active',
	enterToClass: 'fade-enter-to',
	leaveFromClass: 'fade-leave-from',
	leaveActiveClass: 'fade-leave-active',
	leaveToClass: 'fade-leave-to'
};

// Event handlers
function onPanelChange(event) {
	addEventLog('change', `Panel ${event.target.id}: ${event.isOpen ? 'opened' : 'closed'}`);
}

function onPanelOpen(event) {
	addEventLog('change:open', `Panel ${event.target.id} opened`);
}

function onPanelClose(event) {
	addEventLog('change:close', `Panel ${event.target.id} closed`);
}

function onHeaderFocus(event) {
	focusedHeader.value = event.target.id;
}

// Utility functions
function addEventLog(type, data) {
	const event = {
		id: Date.now(),
		timestamp: new Date().toLocaleTimeString(),
		type,
		data
	};

	eventHistory.value.unshift(event);

	// Keep only last 10 events
	if (eventHistory.value.length > 10) {
		eventHistory.value = eventHistory.value.slice(0, 10);
	}

	// Auto-scroll to top of log
	nextTick(() => {
		if (eventLog.value) {
			eventLog.value.scrollTop = 0;
		}
	});
}

function clearEventLog() {
	eventHistory.value = [];
}

function openAll() {
	if (minOneAccordion.value?.openAll) {
		minOneAccordion.value.openAll();
	}
	if (maxOneAccordion.value?.openAll) {
		maxOneAccordion.value.openAll();
	}
}

function closeAll() {
	if (minOneAccordion.value?.closeAll) {
		minOneAccordion.value.closeAll();
	}
	if (maxOneAccordion.value?.closeAll) {
		maxOneAccordion.value.closeAll();
	}
}

// Watch v-model changes
watch(panel1Open, (newVal, oldVal) => {
	if (newVal !== oldVal) {
		addEventLog('v-model', `Panel 1 v-model changed to: ${newVal ? 'open' : 'closed'}`);
	}
});
</script>

<style lang="css">
	/* Playground Styles */
.playground {
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	line-height: 1.6;
}

.playground h1 {
	text-align: center;
	color: #2c3e50;
	margin-bottom: 2rem;
	font-size: 2.5rem;
}

.playground h2 {
	color: #3498db;
	border-bottom: 2px solid #3498db;
	padding-bottom: 0.5rem;
	margin-top: 3rem;
	margin-bottom: 1rem;
}

.playground h3 {
	color: #e74c3c;
	margin-top: 2rem;
	margin-bottom: 1rem;
}

/* Navigation */
nav {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: center;
	margin-bottom: 3rem;
	padding: 1rem;
	background: #f8f9fa;
	border-radius: 8px;
}

nav a {
	padding: 0.5rem 1rem;
	background: #3498db;
	color: white;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.3s;
}

nav a:hover {
	background: #2980b9;
}

/* Section Styling */
.example-section {
	margin-bottom: 4rem;
	padding: 2rem;
	border: 1px solid #e1e8ed;
	border-radius: 8px;
	background: #ffffff;
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Accordion Basic Styling */
.c-accordion-group {
	border: 1px solid #dee2e6;
	border-radius: 6px;
	margin: 1rem 0;
}

.c-accordion-header {
	width: 100%;
	padding: 1rem 1.5rem;
	background: #f8f9fa;
	border: none;
	border-bottom: 1px solid #dee2e6;
	text-align: left;
	cursor: pointer;
	font-size: 1rem;
	font-weight: 500;
	transition: background-color 0.2s, color 0.2s;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.c-accordion-header:hover {
	background: #e9ecef;
}

.c-accordion-header:focus {
	outline: 2px solid #3498db;
	outline-offset: -2px;
	background: #e7f3ff;
}

.c-accordion-header[aria-expanded="true"] {
	background: #3498db;
	color: white;
}

.c-accordion-header[aria-disabled="true"] {
	background: #f8f9fa;
	color: #6c757d;
	cursor: not-allowed;
	opacity: 0.6;
}

.c-accordion-header::after {
	content: "▼";
	transition: transform 0.2s;
	margin-left: auto;
	padding-left: 1rem;
}

.c-accordion-header[aria-expanded="true"]::after {
	transform: rotate(180deg);
}

.c-accordion-panel {
	padding: 1.5rem;
	border-bottom: 1px solid #dee2e6;
	background: white;
}

.c-accordion-panel:last-child {
	border-bottom: none;
	border-radius: 0 0 6px 6px;
}

/* Nested Accordion Styling */
.c-accordion-group .c-accordion-group {
	margin: 1rem 0;
	border-left: 3px solid #3498db;
}

.c-accordion-group .c-accordion-group .c-accordion-header {
	background: #f1f8ff;
	padding-left: 2rem;
}

.c-accordion-group .c-accordion-group .c-accordion-group .c-accordion-header {
	background: #e8f4ff;
	padding-left: 3rem;
}

/* Control Buttons */
.demo-controls, .model-controls {
	display: flex;
	gap: 1rem;
	margin: 1rem 0;
	flex-wrap: wrap;
	align-items: center;
}

.toggle-btn, .clear-btn {
	padding: 0.5rem 1rem;
	background: #17a2b8;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.toggle-btn:hover, .clear-btn:hover {
	background: #138496;
}

.demo-controls button {
	padding: 0.75rem 1.5rem;
	background: #28a745;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s;
}

.demo-controls button:hover {
	background: #218838;
}

.demo-controls button:first-child {
	background: #28a745;
}

.demo-controls button:last-child {
	background: #dc3545;
}

.demo-controls button:last-child:hover {
	background: #c82333;
}

/* Hash Navigation */
.hash-links {
	display: flex;
	gap: 1rem;
	margin: 1rem 0;
	flex-wrap: wrap;
}

.hash-links a {
	padding: 0.5rem 1rem;
	background: #6f42c1;
	color: white;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.2s;
}

.hash-links a:hover {
	background: #5a32a3;
}

.highlight-target {
	padding: 1rem;
	background: #fff3cd;
	border: 1px solid #ffeaa7;
	border-radius: 4px;
	margin: 1rem 0;
	text-align: center;
	font-weight: bold;
}

/* Accessibility Features */
.accessibility-info {
	background: #e8f5e8;
	padding: 1.5rem;
	border-radius: 6px;
	margin: 1rem 0;
}

.accessibility-info h3 {
	margin-top: 0;
	color: #155724;
}

.accessibility-info kbd {
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-radius: 3px;
	padding: 0.2rem 0.4rem;
	font-size: 0.85rem;
	font-family: 'Monaco', 'Menlo', monospace;
}

/* Event Log */
.event-log {
	margin: 1rem 0;
	background: #f8f9fa;
	border: 1px solid #dee2e6;
	border-radius: 6px;
	padding: 1rem;
}

.log-container {
	max-height: 200px;
	overflow-y: auto;
	background: white;
	border: 1px solid #dee2e6;
	border-radius: 4px;
	padding: 0.5rem;
	margin: 1rem 0;
}

.log-entry {
	display: flex;
	gap: 1rem;
	padding: 0.25rem 0;
	font-family: 'Monaco', 'Menlo', monospace;
	font-size: 0.85rem;
	border-bottom: 1px solid #f8f9fa;
}

.log-entry:last-child {
	border-bottom: none;
}

.timestamp {
	color: #6c757d;
	min-width: 80px;
}

.event-type {
	color: #e83e8c;
	font-weight: bold;
	min-width: 100px;
}

.event-data {
	color: #495057;
}

/* Demo Content */
.demo-content {
	margin: 1rem 0;
}

.demo-content img {
	max-width: 100%;
	height: auto;
	border-radius: 4px;
}

.demo-content p {
	margin: 0.5rem 0;
}

/* Transition Classes */

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
	transition: all 0.5s ease;
	overflow: hidden;
}

.slide-enter-from {
	max-height: 0;
	opacity: 0;
	transform: translateY(-10px);
}

.slide-enter-to {
	max-height: var(--accordion-panel-max-height, 1000px);
	opacity: 1;
	transform: translateY(0);
}

.slide-leave-from {
	max-height: var(--accordion-panel-max-height, 1000px);
	opacity: 1;
	transform: translateY(0);
}

.slide-leave-to {
	max-height: 0;
	opacity: 0;
	transform: translateY(-10px);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}

/* Responsive Design */
@media (max-width: 768px) {
	.playground {
		padding: 1rem;
	}

	nav {
		gap: 0.5rem;
	}

	nav a {
		padding: 0.4rem 0.8rem;
		font-size: 0.9rem;
	}

	.demo-controls, .model-controls, .hash-links {
		flex-direction: column;
		align-items: stretch;
	}

	.demo-controls button, .toggle-btn, .clear-btn, .hash-links a {
		text-align: center;
	}

	.c-accordion-header {
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
	}

	.c-accordion-panel {
		padding: 1rem;
	}
}

/* Print Styles */
@media print {
	.playground {
		font-size: 12pt;
		line-height: 1.4;
	}

	nav, .demo-controls, .hash-links, .event-log {
		display: none;
	}

	.c-accordion-panel {
		display: block !important;
	}

	.example-section {
		break-inside: avoid;
	}
}
</style>
