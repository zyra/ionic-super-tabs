# super-tabs



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                                                                                                                                                  | Type                           | Default     |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ----------- |
| `activeTabIndex` | `active-tab-index` | Initial active tab index. Defaults to `0`.                                                                                                                   | `number`                       | `0`         |
| `config`         | --                 | Global Super Tabs configuration.  This is the only place you need to configure the components. Any changes to this input will propagate to child components. | `SuperTabsConfig \| undefined` | `undefined` |


## Events

| Event       | Description                                                                                                                                                                                                                                            | Type                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| `tabChange` | Tab change event.  This event fires up when a tab button is clicked, or when a user swipes between tabs.  The event will fire even if the tab did not change, you can check if the tab changed by checking the `changed` property in the event detail. | `CustomEvent<SuperTabChangeEventDetail>` |


## Methods

### `selectTab(index: number, animate?: boolean) => Promise<void>`

Set the selected tab.
This will move the container and the toolbar to the selected tab.

#### Returns

Type: `Promise<void>`



### `setConfig(config: SuperTabsConfig) => Promise<void>`

Set/update the configuration

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
