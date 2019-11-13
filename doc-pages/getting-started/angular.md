# Getting Started with Angular


## Installation

#### 1. Install the module
```shell
npm i --save @ionic-super-tabs/angular
```
#### 2. Import the module
You must import `SuperTabsModule.forRoot()` once only. This is usually imported in your app's root module (e.g `AppModule`), 
but it can be imported in other modules depending on your app structure.

For lazy loaded app you must also import `SuperTabsModule` to have access to the provided components.

```typescript
import { SuperTabsModule } from '@ionic-super-tabs/angular';

// Root module import example
@NgModule({
  ...
  imports: [
    ...
    SuperTabsModule.forRoot(),
  ],
  ...
})
export class AppModule {}

// Child module import example
@NgModule({
  ...
  imports: [
    ...
    SuperTabsModule,
  ],
  ...
})
export class HomePageModule {}
```   


See the [Angular Usage Guide](/usage/angular) for examples on how to setup ***Super Tabs***.
