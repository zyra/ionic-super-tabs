# super-tabs-toolbar



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type                           | Default     |
| ----------------- | ------------------ | ----------- | ------------------------------ | ----------- |
| `color`           | `color`            |             | `string`                       | `'primary'` |
| `config`          | --                 |             | `SuperTabsConfig \| undefined` | `undefined` |
| `scrollable`      | `scrollable`       |             | `boolean`                      | `false`     |
| `showIndicator`   | `show-indicator`   |             | `boolean`                      | `true`      |
| `toolbarPosition` | `toolbar-position` |             | `"bottom" \| "top"`            | `'top'`     |


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



### `onButtonClick(button: HTMLSuperTabButtonElement) => void`



#### Parameters

| Name     | Type                        | Description |
| -------- | --------------------------- | ----------- |
| `button` | `HTMLSuperTabButtonElement` |             |

#### Returns

Type: `void`



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
