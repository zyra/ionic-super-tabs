# super-tabs



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description                     | Type                           | Default     |
| ---------------- | ------------------ | ------------------------------- | ------------------------------ | ----------- |
| `activeTabIndex` | `active-tab-index` | Initial active tab index        | `number`                       | `0`         |
| `config`         | --                 | Global Super Tabs configuration | `SuperTabsConfig \| undefined` | `undefined` |


## Events

| Event       | Description | Type                                     |
| ----------- | ----------- | ---------------------------------------- |
| `tabChange` |             | `CustomEvent<SuperTabChangeEventDetail>` |


## Methods

### `selectTab(index: number, animate?: boolean) => Promise<void>`

Set the selected tab.
This will move the container and the toolbar to the selected tab.

#### Returns

Type: `Promise<void>`



### `setConfig(config: SuperTabsConfig) => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
