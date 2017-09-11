[![npm](https://img.shields.io/npm/l/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs/)
[![npm](https://img.shields.io/npm/dt/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs)
[![npm](https://img.shields.io/npm/dm/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs)

# Swipeable tabs for Ionic 2

Swipeable tabs that can be your main navigation, or just a part of your page.

To see this in action, checkout the [example project here](https://github.com/zyra/ionic2-super-tabs-example).


<br><br>

![Example](https://github.com/zyra/ionic2-super-tabs-example/blob/master/example.gif?raw=true)

<br><br>

- [Compatibility](#compatibility)
- [Quick Example](#quick-example)
- [How it works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
  - [`super-tabs` Component](#super-tabs-component)
  - [`super-tab` Component](#super-tab-component)
  - [`SuperTabsController` Provider](#super-tabs-controller-provider)
  - [Colors](#colors)
- [Examples](#examples)
- [Project goals](#project-goals)

<br><br><br>

# Compatibility
Due to the way this module is designed, some versions of the module might not work with all versios of the Ionic Framework. Refer to the following table to use the appropriate version. Also, some features in the later versions might not be available in the older versions of this module. This page only contains the latest documentation. For older documentation, look up the previous versions of the `README.md` file using Github.

| Ionic Framework Version | ionic2-super-tabs version |
| --- | --- |
| 3.5.2 - 3.6.x | ^4.0.1 |
| 3.5.0 | 3.0.2 |
| 3.4.x | 2.6.3 |
| 3.0.0 - 3.3.x | 2.0.0 - 2.6.3 |
| 2.x.x | 1.x.x |

<br><br><br>

# Quick Example
```html
<super-tabs>
  <super-tab [root]="page1" title="First page"></super-tab>
  <super-tab [root]="page2" title="Second page"></super-tab>
  <super-tab [root]="page3" title="Third page"></super-tab>
</super-tabs>
```

<br><br><br>

# Installation
## Install the module via NPM
```shell
npm i --save ionic2-super-tabs
```

## Import it in your app's module(s)

Import `SuperTabsModule.forRoot()` in your app's main module

```ts
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
    ...
    imports: [
      ...
      SuperTabsModule.forRoot()
      ],
    ...
})
export class AppModule {}
```

If your app uses lazy loading, you need to import `SuperTabsModule` in your shared module or child modules:
```ts
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
    ...
    imports: [
      ...
      SuperTabsModule
      ],
    ...
})
export class SharedModule {}
```

<br><br><br>

# Usage


## `super-tabs` Component

### Inputs

#### selectedTabIndex
_(optional)_ The index of the tab that is selected when the component is initialized. Defaults to `0`.

#### toolbarBackground
_(optional)_ The background color of the toolbar that contains the tab buttons. See [colors](#colors) for more information.

#### toolbarColor
_(optional)_ The color of the text and icons inside the toolbar. See [colors](#colors) for more information.

#### indicatorColor
_(optional)_ The color of the tab indicator. See [colors](#colors) for more information. Defaults to `primary`.

#### badgeColor
_(optional)_ The color of the badge. See [colors](#colors) for more information. Defaults to `primary`.

#### tabsPlacement
_(optional)_ Placement of the tabs buttons. Defaults to `top`.

#### scrollTabs
_(optional)_ Set to `true` to enable tab bar swiping. Useful if you have lots of tabs.

#### id
_(optional)_ Unique instance ID. You will need this if you wish to use the `SuperTabsController` provider.

#### config
_(optional)_ Advanced configuration.

Param | Description | Default
--- | --- | ---
`dragThreshold` | The number of pixels that the user must swipe through before the drag event triggers. | `20`
`maxDragAngle` | The maximum angle that the user can drag at for the drag event to trigger. | `40`
`transitionEase` | The transition timing function to use in animations. | `'cubic-bezier(0.35, 0, 0.25, 1)'`
`transitionDuration` | The duration of animations in milliseconds. | `300`
`sideMenu` | Specify if there is a side menu in the parent view. This value can be set to `'left'`, `'right'`, or `'both'`. | N/A
`sideMenuThreshold` | The number of pixels from right/left where the side menu events are captured. Drag even will not trigger if the swipe started from these areas. | `50`
`shortSwipeDuration` | The user has to swipe faster than the duration specified here for a short swipe event to trigger. Short swipes are quick swipes to change the tabs quickly. Set to `0` to disable this. | `300`

### Outputs

#### `tabSelect`
Listen to this event to be notified when the user selects a tab. This event emits an object containing the index of the tab, as well as it's unique ID. [See example](#example-with-all-options) below for more details.

### Methods

All methods documented below under `SuperTabsController` can be applied directly to an instance. Here's an example:
```ts
export class MyPage {

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  
  slideToIndex(index: number) {
    this.superTabs.slideTo(index);
  }
  
  hideToolbar() {
    this.superTabs.showToolbar(false);
  }
  
}
```


<br><br>

## `super-tab` Component

### Inputs
#### root
The root page for this tab

#### rootParams
_(optional)_ An object containing the params you would like to pass to this tab's root page

#### title
_(optional)_ The title of the tab to display in the `ion-segment-button`.

#### icon
_(optional)_ The name of the icon to display in the `ion-segment-button`. This has to be a valid `ion-icon` name.

#### badge
_(optional)_ The initial badge value. The number can be changed through the `SuperTabsController` provider.

#### id
_(optional)_ A unique ID to be used if you wish to use the `SuperTabaController` provider to modify this tab.


<br><br>

## `SuperTabsController` Provider

### setBadge
```ts
setBadge(tabId: string, value: number, tabsId?: string): void
```
Set the badge value for a tab.
- **tabId**: the unique ID of the tab
- **value**: the new value for the badge
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.


### clearBadge
```ts
clearBadge(tabId: string, tabsId?: string): void
```
Clears the badge value for a tab.
- **tabId**: the unique ID of the tab
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

### increaseBadge
```ts
increaseBadge(tabId: string, increaseBy: number = 1, tabsId?: string): void
```
Increase the badge for a tab by a value.
- **tabId**: the unique ID of the tab
- **increaseBy**: the value to increase by. Defaults to `1`.
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

### decreaseBadge
```ts
decreaseBadge(tabId: string, increaseBy: number = 1, tabsId?: string): void
```
Decrease the badge for a tab by a value.
- **tabId**: the unique ID of the tab
- **decreaseBy**: the value to decrease by. Defaults to `1`.
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

### enableTabsSwipe
```ts
enableTabsSwipe(enable: boolean, tabsId?: string): void
```
Enable/disable swiping.
- **enable**: boolean that indicates whether to enable swiping
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

### enableTabSwipe
```ts
enableTabSwipe(enable: boolean, tabId: string, tabsId?: string): void
```
Enable/disable swiping when the specified tab is the current active one.
- **enable**: boolean that indicates whether to enable swiping
- **tabId**: the unique ID of the tab
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

### showToolbar
```ts
showToolbar(show: boolean, tabsId?: string): void
```
Show/hide toolbar
- **show**: boolean that indicates whether to show the toolbar
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

### slideTo
```ts
slideTo(tabIndexOrId: string | number, tabsId?: string): void
```
Slide to a tab.
- **tabIndexOrId**: the index or the unique ID of the tab
- **tabsId**: the unique ID for parent `SuperTabs`. Defaults to the first instance registered in memory.

<br><br>

## Colors
All color inputs takes color names like any other Ionic 2 component. Your color name must be defined in the `$colors` map in your `variables.scss` file. 

<br><br><br>

# Examples

## Basic example
```ts
export class MyPage {

  page1: any = Page1Page;
  page2: any = Page2Page;
  page3: any = Page3Page;
  
}
```
```html
<super-tabs>
  <super-tab [root]="page1" title="First page"></super-tab>
  <super-tab [root]="page2" title="Second page"></super-tab>
  <super-tab [root]="page3" title="Third page"></super-tab>
</super-tabs>
```

<br><br>

## Example with icons
```html
<super-tabs>
  <super-tab [root]="page1" title="First page" icon="home"></super-tab>
  <super-tab [root]="page2" title="Second page" icon="pin"></super-tab>
  <super-tab [root]="page3" title="Third page" icon="heart"></super-tab>
</super-tabs>
```

<br><br>

## Example with all options
```ts
export class MyPage {

  page1: any = Page1Page;
  page2: any = Page2Page;
  page3: any = Page3Page;
  
  constructor(private superTabsCtrl: SuperTabsController) { }
  
  ngAfterViewInit() {
  
    // must wait for AfterViewInit if you want to modify the tabs instantly
    this.superTabsCtrl.setBadge('homeTab', 5);
  
  }
  
  hideToolbar() {
    this.superTabsCtrl.showToolbar(false);
  }
  
  showToolbar() {
    this.superTabsCtrl.showToolbar(true);
  }
  
  onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
  }
  
}
```
```html
<super-tabs id="mainTabs" selectedTabIndex="1" toolbarColor="light" toolbarBackground="dark" indicatorColor="light" badgeColor="light" [config]="{ sideMenu: 'left' }" (tabSelect)="onTabSelect($event)">
  <super-tab [root]="page1" title="First page" icon="home" id="homeTab"></super-tab>
  <super-tab [root]="page2" title="Second page" icon="pin" id="locationTab"></super-tab>
  <super-tab [root]="page3" title="Third page" icon="heart" id="favouritesTab"></super-tab>
</super-tabs>
```

<br><br>
## Contribution
- **Having an issue**? or looking for support? [Open an issue](https://github.com/zyra/ionic2-super-tabs/issues/new) and we will get you the help you need.
- Got a **new feature or a bug fix**? Fork the repo, make your changes, and submit a pull request.

## Support this project
If you find this project useful, please star the repo to let people know that it's reliable. Also, share it with friends and colleagues that might find this useful as well. Thank you :smile:
