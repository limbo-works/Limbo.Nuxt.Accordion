# `Accordion`

Vue accordion component is a list of headers that hide or reveal additional content when selected/opened. that contains the AccordionGroup as the wrapper of the accordion, AccordionHeader as the header of each panel and the AccordionPanel for the panels that has two states of collapsed and expanded.

## Using the components

Import and register the AccordionGroup, AccordionHeader, AccordionPanel component make sure that the AccordionHeader and AccordionPanel are wrapped by AccordionGroup like you see below but it doesn't need to be direct descendents:
If used as a layer the components are auto-imported and may simply be used as-is.

```js
import {
	AccordionGroup,
	AccordionHeader,
	AccordionPanel,
} from '@limbo-works/accordion/components/Accordion/';

export default {
	name: 'ExampleComponent',
	components: { AccordionGroup, AccordionHeader, AccordionPanel },
};
```

```html
<!-- As written in Vue -->
<AccordionGroup>
	<template v-for="(item, index) in items">
		<AccordionHeader
			:id="`${item.key}`"
			:aria-controls="`panel-${index}`"
			:key="`header-${index}`"
		>
			{{ item.headerContentHere }}
		</AccordionHeader>

		<AccordionPanel :id="panel-`${index}`" :key="`panel-${index}`">
			{{ item.panelContentHere }}
		</AccordionPanel>
	</template>
</AccordionGroup>
```

### Props overview

#### AccordionGroup's props overview

| Prop       | Description                                                                                                                                                 | Default value | Data type |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------- |
| tag        | The element tag to use for the wrapper.                                                                                                                     | "div"         | String    |
| minOneOpen | You can use minOneOpen if you want to limit the maximum number of open panels to one, so if you open another panel the one that was opened will get closed. | false         | Boolean   |
| maxOneOpen | You can use maxOneOpen if you don't want to limit the maximum number of open panels to one, so if you open a panel it wont close the other open panels.     | false         | Boolean   |

#### AccordionHeader's props overview

| Prop         | Description                                                                                                                                                                                                                                                                                         | Default value | Data type |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | --------- |
| tag          | The element tag to use for the header.                                                                                                                                                                                                                                                              | "button"      | String    |
| id           | Required, distinguish the headers from each other and functions like the normal id-attribute,.                                                                                                                                                                                                      |               | String    |
| ariaControls | Required, identifies the element whose contents or presence are controlled by the element on which the attribute is set. `It should match with the panel id so by clicking on each header we can open the related panel to the clicked header.` Functions like the normal aria-controls attribute . |               | String    |
| ariaDisabled | A state indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.                                                                                                                                                                                        | "false"       | String    |

#### AccordionPanel's props overview

| Prop                    | Description                                                                                                                                                           | Default value                                                    | Data type      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------- |
| tag                     | The element tag to use for the panel.                                                                                                                                 | "div"                                                            | String         |
| transition              | Object containing properties parsed onto the Transition element.                                                                                                      | null                                                             | Object         |
| id                      | Required, distinguishes the panels from each other and functions like the normal id-attribute.                                                                        |                                                                  | String         |
| ariaLabel               | Defines a string value that labels an interactive element.                                                                                                            | undefined                                                        | String         |
| ariaLabelledby          | Identifies the element that labels the element it is applied to.                                                                                                      | undefined                                                        | String         |
| startOpen               | If set to true, the panels will be open after the page has rendered.                                                                                                  | false                                                            | Boolean        |
| openByHash              | If set to either true or an object then the panel will be open when the URL hash is set to the id of the panel.                                                       | default: () => ({header: true,panel: false,withinPanel: false,}) | Boolean/Object |
| openParentWhenOpened    | Only applicable to nested accordions. When this property is set to true on a child accordion, opening the accordion will also open the parent accordion.              | true                                                             | Boolean        |
| closeChildrenWhenClosed | Only applicable to nested accordions. When this property is set to true on a parent accordion, closing the accordion will also trigger all child accordions to close. | true                                                             | Boolean        |

### Events overview

#### AccordionPanel's events

| Event   | Description                                        | Value                                                   |
| ------- | -------------------------------------------------- | ------------------------------------------------------- |
| @change | Its called whenever the panel is opened or closed. | {isOpen: Boolean, target:DOMElement, component: Object} |

### Exposed slot props

The default slot on AccordionGroup exposes the following properties: { hasFocus: Boolean, openAll: Function, closeAll: Function } so we can check if the element has focus on and by openAll and closeAll we can set a button to open or close all the panels
