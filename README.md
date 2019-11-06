# Swipeable tabs for Ionic

[![npm](https://img.shields.io/npm/l/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs/)
[![npm](https://img.shields.io/npm/dt/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs)
[![npm](https://img.shields.io/npm/dm/ionic2-super-tabs.svg)](https://www.npmjs.com/package/ionic2-super-tabs)
[![Build Status](https://drone.zyra.ca/api/badges/zyra/ionic-super-tabs/status.svg)](https://drone.zyra.ca/zyra/ionic-super-tabs)

---

## Installation
```shell
# Vanilla JS / React / Vue
npm i -S @ionic-super-tabs/core

# Angular
npm i -S @ionic-super-tabs/angular
```
---

## Usage

#### Angular
```html
<super-tabs [config]="config" (tabChange)="onTabChange($event)">
  <super-tabs-container>
    <super-tab>
      <!-- You can pass anything to a super tab including an ion-nav -->
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
