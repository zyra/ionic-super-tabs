# Angular Usage Guide

* [Basic usage](#basic-usage)
* [Scrollable toolbar](#scrollable-toolbar)
* [Toolbar positioning](#toolbar-positioning)
* [Routing](#routing)
* [Theming](#theming)

## Basic usage
```html
<ion-header class="ion-no-border">
  <ion-toolbar>
    <ion-title>Super Tabs</ion-title>
  </ion-toolbar>
</ion-header>

<super-tabs>
  <super-tabs-toolbar slot="top">
    <super-tab-button>
      <ion-icon name="home"></ion-icon>
      <ion-label>Page #1</ion-label>    
    </super-tab-button>
    <super-tab-button>
      <ion-icon name="home"></ion-icon>
      <ion-label>Page #2</ion-label>    
    </super-tab-button>
    <super-tab-button>
      <ion-icon name="home"></ion-icon>
      <ion-label>Page #3</ion-label>    
    </super-tab-button>
  </super-tabs-toolbar>
  <super-tabs-container>
    <super-tab>
      <ion-content>
        Page #1
      </ion-content>
    </super-tab>
    <super-tab>
      <ion-content>
        Page #2
      </ion-content>
    </super-tab>
    <super-tab>
      <ion-content>
        Page #3
      </ion-content>
    </super-tab>
  </super-tabs-container>
</super-tabs>
```

## Scrollable toolbar
Enabling toolbar scrolling is recommended if the toolbar gets crowded with many tabs.

To enable this feature, set the `scrollable` attribute on `<super-tabs-toolbar>`.

Example:
```html
<super-tabs>
  <super-tab-toolbar slot="top" scrollable>
    <!-- ... -->  
  </super-tab-toolbar>
  <!-- ... -->
</super-tabs>
```

## Toolbar positioning
To position the toolbar below the tabs, set the `slot` attribute to `bottom`.

Example:
```html
<super-tabs>
  <super-tab-toolbar slot="bottom">
    <!-- ... -->  
  </super-tab-toolbar>
  <!-- ... -->
</super-tabs>
```

## Routing
To use external pages inside a `<super-tab>` you can use `<ion-nav>` *<small>(instead of `<ion-content>` in basic usage example)</small>*.

Note that lazy loading is not supported yet, so you must pass the target page as a variable.

Example:
```html
<super-tabs>
  <!-- ... -->
  <super-tabs-container>
     <!-- ... -->
     <super-tab>
       <ion-nav [root]="myPage" [rootParams]="{ hello: 'world' }"></ion-nav>
     </super-tab>
  </super-tabs-container>
</super-tabs>
``` 

```ts
import { MyPage } from '../path/to/my.page';

@Component({
  ...
})
export class HomePage {
  myPage = MyPage;
}
```

## Theming
Styling ***Super Tabs*** can be done by setting the available CSS variables. To see the available variables check the 
documentation for the specific element.

You can set variables in your page:
```scss
// home.page.scss
:host {  
  --super-tabs-toolbar-background: black;
  --st-indicator-color: yellow;
}
```

or in your root variables:
```scss
// variables.scss
:root {
  --st-base-color-inactive: rgba(255, 255, 255, 0.6);
  --st-base-color-active: rgba(255, 255, 255, 0.99);
}
```
