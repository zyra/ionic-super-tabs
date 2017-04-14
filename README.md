# Swipeable tabs for Ionic 2

---
# DISCLAIMER
This branch is for the upcoming v2.0 of this module. To install this from NPM, you need to add the `@next` tag. Please note that there will be breaking changes in the upcoming alpha releases, so make sure you use `--save-exact` when installing this version, and check here for any updates before updating to a later alpha version.
---

Swipeable tabs that can be your main navigation, or just a part of your page.

To see this in action, checkout the [example project here](https://github.com/zyramedia/ionic2-super-tabs-example).

<br><br>

![Example](https://github.com/zyramedia/ionic2-super-tabs-example/blob/master/example.gif?raw=true)

<br><br>

- [Quick Example](#quick-example)
- [How it works](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
  - [`super-tabs` Component Inputs](#super-tabs-inputs)
  - [`super-tab` Component Inputs](#super-tab-inputs)
  - [Colors](#colors)
- [Examples](#examples)
- [Project goals](#project-goals)

<br><br><br>

# Quick Example
```html
<super-tabs height="100%">
  <super-tab [tabRoot]="page1" title="First page"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page"></super-tab>
</super-tabs>
```


<br><br><br>

# How it works
This module combines `ion-segment`, `ion-slides` and some magic to give you swipeable tabs. Each tab has it's own `ion-nav`, which means they each have their own state, controller ...etc.

<br><br><br>

# Installation
## Install the module via NPM
```
npm i --save ionic2-super-tabs@next
```

## Import it in your app's module(s)

Import `SuperTabsModule.forRoot()` in your app's main module

```
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
```
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


## `super-tabs` Inputs

### selectedTabIndex
_(optional)_ The index of the tab that is selected when the component is initialized. Defaults to `0`.

### rootNavCtrl
_(optional)_ The `NavController` of the parent page. This is helpful if you want to push new views to the parent page instead of the child page.

### toolbarColor
_(optional)_ The color of the toolbar that contains the `ion-segment`. See [colors](#colors) for more information.

### tabsColor
_(optional)_ The color of the `ion-segment` component. See [colors](#colors) for more information.

### indicatorColor
_(optional)_ The color of the tab indicator. The indicator is the line below the `ion-segment` that moves according to what tab is selected. See [colors](#colors) for more information. Defaults to `primary`.

### height
The height of `super-tabs` component. Set this to `100%` to fill the whole page, or any other value.


<br><br>

## `super-tab` Inputs

### tabRoot
The root page for this tab

### navParams
_(optional)_ An object containing the params you would like to pass to this tab's root page

### title
_(optional)_ The title of the tab to display in the `ion-segment-button`.

### icon
_(optional)_ The name of the icon to display in the `ion-segment-button`. This has to be a valid `ion-icon` name.

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
<super-tabs height="100%">
  <super-tab [tabRoot]="page1" title="First page"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page"></super-tab>
</super-tabs>
```

<br><br>

## Example with icons
```html
<super-tabs height="100%">
  <super-tab [tabRoot]="page1" title="First page" icon="home"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page" icon="pin"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page" icon="heart"></super-tab>
</super-tabs>
```

<br><br>

## Example with all options
```ts
export class MyPage {

  page1: any = Page1Page;
  page2: any = Page2Page;
  page3: any = Page3Page;
  
  constructor(public navCtrl: NavController){}
  
}
```
```html
<super-tabs height="100%" selectedTabIndex="1" [rootNavCtrl]="navCtrl" tabsColor="light" toolbarColor="dark" indicatorColor="light">
  <super-tab [tabRoot]="page1" title="First page" icon="home"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page" icon="pin"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page" icon="heart"></super-tab>
</super-tabs>
```