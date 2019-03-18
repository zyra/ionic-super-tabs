# ionic2-super-tabs

This branch is WIP

Checkout the [v5](https://github.com/zyra/ionic2-super-tabs/tree/v5) branch for  the current stable version.

---

This branch is for the updated version of Super Tabs that supports Ionic 4 applications.

What to expect:
- The module is being rewritten in Stencil to be framework agnostic
- Performance improvements
- Angular bindings and optimizations
- Styling via CSS variables
- Dynamic data support (e.g: `*ngFor="let tab of tabs"`)
- Custom content support
- React + Vue support (not a priority)

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
