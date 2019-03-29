# Swipeable tabs for Ionic

[![npm](https://img.shields.io/npm/l/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs/)
[![npm](https://img.shields.io/npm/dt/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs)
[![npm](https://img.shields.io/npm/dm/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs)

Master branch is currently unstable. The module is being rewritten in [Stencil JS](https://stenciljs.com) to
provide support for latest Ionic Framework version, and reap the benefits of web components in the process.


Checkout the [v5](https://github.com/zyra/ionic-super-tabs/tree/v5) branch for  the current stable version.

Checkout the [example project](https://github.com/zyra/ionic-super-tabs-example) to see the new version in action.

---

## Installation
```shell
# Vanilla JS / React / Vue
npm i -S @ionic-super-tabs/core

# Angular
npm i -S @ionic-super-tabs/angular
```

#### Temporary installation requirement:
Add `node_modules/@ionic-super-tabs/core/dist/types/index.d.ts` to your `tsconfig.json` file under the `"include"` property.

---

## FAQ

#### What to expect in the next stable release?
- Ionic 4+ support
- Framework agnostic with Angular wrappers
- Styling with CSS variables
- Dynamic data support (e.g: `*ngFor="let tab of tabs"`)
- Custom content support. A `super-tab` is no longer a wrapper for `ion-nav`!
- Improved performance

#### When will the next version be ready?
You can start using the new super tabs version, but it is currently still in beta. A stable release is expected
to be released by April 12, 2019. Until then, any beta/rc versions might have breaking changes that will not be
documented in any change log.

#### What will the new syntax look like?  

```html
<!-- 
  # Only global inputs/outputs will be passed through the super-tabs component
  # The rest of the i/o is split throughout the components to make usage more 
  # intuitive and customizable.
 -->
<super-tabs [config]="config" (tabChange)="onTabChange($event)">
  <super-tabs-container>
    <super-tab>
      <!-- You can pass anything to a super tab including an ion-nav -->
      <!-- If you choose to pass an ion-nav, it will be controlled and optimized by super-tab -->
      <ion-nav [root]="myPage" [rootParams]="myParams"></ion-nav>
    </super-tab>
    <super-tab>...</super-tab>
    <super-tab>...</super-tab>
    <!-- ability to dynamically add or remove tabs -->
    <super-tab *ngFor="let tab of tabs">...</super-tab>
  </super-tabs-container>
  
  <super-tabs-toolbar>
    <!-- Listen to click events on any tab button -->
    <super-tab-button (click)="onTabClick($event)">
      <ion-label>Call</ion-label>
      <ion-icon name="call"></ion-icon>
    </super-tab-button>
    <super-tab-button>...</super-tab-button>
    <super-tab-button>...</super-tab-button>
    <super-tab-button *ngFor="let tab of tabs">...</super-tab-button>
  </super-tabs-toolbar>
</super-tabs>
```
