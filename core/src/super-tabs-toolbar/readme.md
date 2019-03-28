# super-tabs-toolbar



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute            | Description                                             | Type                           | Default     |
| ------------------- | -------------------- | ------------------------------------------------------- | ------------------------------ | ----------- |
| `color`             | `color`              | Background color. Defaults to `'primary'`               | `string`                       | `'primary'` |
| `config`            | --                   |                                                         | `SuperTabsConfig \| undefined` | `undefined` |
| `scrollable`        | `scrollable`         | Whether the toolbar is scrollable. Defaults to `false`. | `boolean`                      | `false`     |
| `scrollablePadding` | `scrollable-padding` |                                                         | `boolean`                      | `true`      |
| `showIndicator`     | `show-indicator`     | Whether to show the indicator. Defaults to `true`       | `boolean`                      | `true`      |


## Events

| Event         | Description | Type                                     |
| ------------- | ----------- | ---------------------------------------- |
| `buttonClick` |             | `CustomEvent<HTMLSuperTabButtonElement>` |


## Methods

### `moveContainer(scrollX: number, animate?: boolean | undefined) => Promise<void>`



#### Parameters

| Name      | Type                   | Description |
| --------- | ---------------------- | ----------- |
| `scrollX` | `number`               |             |
| `animate` | `boolean \| undefined` |             |

#### Returns

Type: `Promise<void>`



### `setActiveTab(index: number) => void`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `index` | `number` |             |

#### Returns

Type: `void`



### `setSelectedTab(index: number) => void`



#### Parameters

| Name    | Type     | Description |
| ------- | -------- | ----------- |
| `index` | `number` |             |

#### Returns

Type: `void`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
