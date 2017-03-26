Swipeable tabs for Ionic 2.

Work in progress, but essentially works.

```
npm i --save ionic2-super-tabs
```

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

```
<super-tabs height="100%">
  <super-tab [tabRoot]="page1" title="First page" [icon]="'home'"></super-tab>
  <super-tab [tabRoot]="page2" title="Second page" [icon]="'pin'"></super-tab>
  <super-tab [tabRoot]="page3" title="Third page" [icon]="'heart'"></super-tab>
</super-tabs>
```