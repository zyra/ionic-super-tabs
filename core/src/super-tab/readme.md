# super-tab



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute   | Description                                                                                                                                                                                                                                                             | Type      | Default     |
| ----------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `loaded`                | `loaded`    |                                                                                                                                                                                                                                                                         | `boolean` | `false`     |
| `noScroll` _(required)_ | `no-scroll` | Set this to true to prevent vertical scrolling of this tab. Defaults to `false`.  This property will automatically be set to true if there is a direct child element of `ion-content`. To override this behaviour make sure to explicitly set this property to `false`. | `boolean` | `undefined` |
| `visible`               | `visible`   |                                                                                                                                                                                                                                                                         | `boolean` | `false`     |


## Methods

### `getRootScrollableEl() => Promise<HTMLElement | null>`

Returns the root scrollable element

#### Returns

Type: `Promise<HTMLElement | null>`




## CSS Custom Properties

| Name                 | Description                            |
| -------------------- | -------------------------------------- |
| `--super-tab-height` | Height of the tab. Defaults to `100%`. |
| `--super-tab-width`  | Width of the tab. Defaults to `100vw`. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
