# Swipeable tabs for Ionic 2
Swipeable tabs that can be your main navigation, or just a part of your page.

## Quick Example
```
<super-tabs height="100%">
  <super-tab [tabRoot]="page1" title="First page"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page"></super-tab>
</super-tabs>
```

## How it works
This module combines `ion-segment`, `ion-slides` and some magic to give you swipeable tabs. Each tab has it's own `ion-nav`, which means they each have their own state, controller ...etc.

## Installation
### Install the module via NPM
```
npm i --save ionic2-super-tabs
```

### Import it in your `@NgModule`
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
```

## Usage

### `super-tabs` Inputs

#### selectedTabIndex
_(optional)_ The index of the tab that is selected when the component is initialized. Defaults to `0`.

#### rootNavCtrl
_(optional)_ The `NavController` of the parent page. This is helpful if you want to push new views to the parent page instead of the child page.

#### toolbarColor
_(optional)_ The color of the toolbar that contains the `ion-segment`. See [colors](#colors) for more information.

#### tabsColor
_(optional)_ The color of the `ion-segment` component. See [colors](#colors) for more information.

#### sliderColor
_(optional)_ The color of the slider. The slider is the line below the `ion-segment` that moves according to what tab is selected. See [colors](#colors) for more information. Defaults to `primary`.

#### height
The height of `super-tabs` component. Set this to `100%` to fill the whole page, or any other value.

### `super-tab` Inputs

#### tabRoot
The root page for this tab

#### title
_(optional)_ The title of the tab to display in the `ion-segment-button`.

#### icon
_(optional)_ The name of the icon to display in the `ion-segment-button`. This has to be a valid `ion-icon` name.


## Examples

### Basic example
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


### Example with icons
```html
<super-tabs height="100%">
  <super-tab [tabRoot]="page1" title="First page" icon="home"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page" icon="pin"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page" icon="heart"></super-tab>
</super-tabs>
```



### Example with all options
```ts
export class MyPage {

  page1: any = Page1Page;
  page2: any = Page2Page;
  page3: any = Page3Page;
  
  constructor(public navCtrl: NavController){}
  
}
```
```html
<super-tabs height="100%" selectedTabIndex="1" [rootNavCtrl]="navCtrl" tabsColor="light" toolbarColor="dark" sliderColor="light">
  <super-tab [tabRoot]="page1" title="First page" icon="home"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page" icon="pin"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page" icon="heart"></super-tab>
</super-tabs>
```
