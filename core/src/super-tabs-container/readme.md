# super-tabs-container



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description | Type                           | Default     |
| -------------- | --------------- | ----------- | ------------------------------ | ----------- |
| `config`       | --              |             | `SuperTabsConfig \| undefined` | `undefined` |
| `swipeEnabled` | `swipe-enabled` |             | `boolean`                      | `true`      |


## Events

| Event                    | Description | Type                                 |
| ------------------------ | ----------- | ------------------------------------ |
| `activeTabChange`        |             | `CustomEvent<HTMLSuperTabElement[]>` |
| `activeTabIndexChange`   |             | `CustomEvent<number>`                |
| `selectedTabIndexChange` |             | `CustomEvent<number>`                |
| `stTabsChange`           |             | `CustomEvent<HTMLSuperTabElement[]>` |


## Methods

### `moveContainer(scrollX: number, animate?: boolean | undefined) => Promise<void>`



#### Parameters

| Name      | Type                   | Description |
| --------- | ---------------------- | ----------- |
| `scrollX` | `number`               |             |
| `animate` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `moveContainerByIndex(index: number, animate?: boolean | undefined) => Promise<void>`



#### Parameters

| Name      | Type                   | Description |
| --------- | ---------------------- | ----------- |
| `index`   | `number`               |             |
| `animate` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
