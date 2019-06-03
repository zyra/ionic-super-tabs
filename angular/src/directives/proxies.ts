/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter } from '@angular/core';
import { proxyInputs, proxyMethods, proxyOutputs } from './proxies-utils';

import { Components } from '@ionic-super-tabs/core'

export declare interface SuperTab extends Components.SuperTab {}
@Component({ selector: 'super-tab', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>' })
export class SuperTab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(SuperTab, ['getRootScrollableEl']);

export declare interface SuperTabButton extends Components.SuperTabButton {}
@Component({ selector: 'super-tab-button', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class SuperTabButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(SuperTabButton, ['disabled']);

export declare interface SuperTabs extends Components.SuperTabs {}
@Component({ selector: 'super-tabs', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['activeTabIndex', 'config'] })
export class SuperTabs {
  tabChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['tabChange']);
  }
}
proxyMethods(SuperTabs, ['setConfig', 'selectTab']);
proxyInputs(SuperTabs, ['activeTabIndex', 'config']);

export declare interface SuperTabsContainer extends Components.SuperTabsContainer {}
@Component({ selector: 'super-tabs-container', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['autoScrollTop', 'swipeEnabled'] })
export class SuperTabsContainer {
  activeTabIndexChange!: EventEmitter<CustomEvent>;
  selectedTabIndexChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['activeTabIndexChange', 'selectedTabIndexChange']);
  }
}
proxyInputs(SuperTabsContainer, ['autoScrollTop', 'swipeEnabled']);

export declare interface SuperTabsToolbar extends Components.SuperTabsToolbar {}
@Component({ selector: 'super-tabs-toolbar', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['color', 'scrollable', 'scrollablePadding', 'showIndicator'] })
export class SuperTabsToolbar {
  buttonClick!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['buttonClick']);
  }
}
proxyInputs(SuperTabsToolbar, ['color', 'scrollable', 'scrollablePadding', 'showIndicator']);
