# super-tabs-container



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                                                                                             | Type      | Default |
| --------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `autoScrollTop` | `auto-scroll-top` | Set to true to automatically scroll to the top of the tab when the button is clicked while the tab is already selected. | `boolean` | `false` |
| `swipeEnabled`  | `swipe-enabled`   | Enable/disable swiping                                                                                                  | `boolean` | `true`  |


## Events

| Event                    | Description                                                                                                                                                                                                                                                                                    | Type                  |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `activeTabIndexChange`   | Emits an event when the active tab changes. An active tab is the tab that the user looking at.  This event emitter will not notify you if the user has changed the current active tab. If you need that information, you should use the `tabChange` event emitted by the `super-tabs` element. | `CustomEvent<number>` |
| `selectedTabIndexChange` | Emits events when the container moves. Selected tab index represents what the user should be seeing. If you receive a decimal as the emitted number, it means that the container is moving between tabs. This number is used for animations, and can be used for high tab customizations.      | `CustomEvent<number>` |


## Methods

### `scrollToTop() => Promise<void>`

Scroll the active tab to the top.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
