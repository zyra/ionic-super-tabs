/* tslint:disable */
/* auto-generated angular directive proxies */
import { Component, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { proxyInputs, proxyMethods, proxyOutputs } from './proxies-utils';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

export declare interface SuperTab extends StencilComponents<'SuperTab'> {}
@Component({ selector: 'super-tab', changeDetection: 0, template: '<ng-content></ng-content>' })
export class SuperTab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(SuperTab, ['getRootScrollableEl']);

export declare interface SuperTabButton extends StencilComponents<'SuperTabButton'> {}
@Component({ selector: 'super-tab-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled'] })
export class SuperTabButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(SuperTabButton, ['disabled']);

export declare interface SuperTabs extends StencilComponents<'SuperTabs'> {}
@Component({ selector: 'super-tabs', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['config', 'activeTabIndex'] })
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
proxyInputs(SuperTabs, ['config', 'activeTabIndex']);

export declare interface SuperTabsContainer extends StencilComponents<'SuperTabsContainer'> {}
@Component({ selector: 'super-tabs-container', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['swipeEnabled', 'autoScrollTop'] })
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
proxyInputs(SuperTabsContainer, ['swipeEnabled', 'autoScrollTop']);

export declare interface SuperTabsToolbar extends StencilComponents<'SuperTabsToolbar'> {}
@Component({ selector: 'super-tabs-toolbar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['showIndicator', 'color', 'scrollable', 'scrollablePadding'] })
export class SuperTabsToolbar {
  buttonClick!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['buttonClick']);
  }
}
proxyInputs(SuperTabsToolbar, ['showIndicator', 'color', 'scrollable', 'scrollablePadding']);
