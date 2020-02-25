/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './proxies-utils';

import { Components } from '@ionic-super-tabs/core';

export declare interface SuperTab extends Components.SuperTab {}
@ProxyCmp({'methods': ['getRootScrollableEl']})
@Component({ selector: 'super-tab', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>' })
export class SuperTab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface SuperTabButton extends Components.SuperTabButton {}
@ProxyCmp({inputs: ['disabled']})
@Component({ selector: 'super-tab-button', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class SuperTabButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface SuperTabs extends Components.SuperTabs {}
@ProxyCmp({inputs: ['activeTabIndex', 'config'], 'methods': ['setConfig', 'selectTab']})
@Component({ selector: 'super-tabs', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['activeTabIndex', 'config'] })
export class SuperTabs {
  tabChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['tabChange']);
  }
}

export declare interface SuperTabsContainer extends Components.SuperTabsContainer {}
@ProxyCmp({inputs: ['autoScrollTop', 'swipeEnabled'], 'methods': ['scrollToTop']})
@Component({ selector: 'super-tabs-container', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['autoScrollTop', 'swipeEnabled'] })
export class SuperTabsContainer {
  activeTabIndexChange!: EventEmitter<CustomEvent>;
  selectedTabIndexChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['activeTabIndexChange', 'selectedTabIndexChange']);
  }
}

export declare interface SuperTabsToolbar extends Components.SuperTabsToolbar {}
@ProxyCmp({inputs: ['color', 'scrollable', 'scrollablePadding', 'showIndicator']})
@Component({ selector: 'super-tabs-toolbar', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['color', 'scrollable', 'scrollablePadding', 'showIndicator'] })
export class SuperTabsToolbar {
  buttonClick!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['buttonClick']);
  }
}
