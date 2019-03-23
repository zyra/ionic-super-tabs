/* tslint:disable */
/* auto-generated angular directive proxies */
import { Component, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { proxyInputs, proxyMethods, proxyOutputs } from './proxies-utils';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

export declare interface SuperTab extends StencilComponents<'SuperTab'> {}
@Component({ selector: 'super-tab', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['index'] })
export class SuperTab {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(SuperTab, ['index']);

export declare interface SuperTabButton extends StencilComponents<'SuperTabButton'> {}
@Component({ selector: 'super-tab-button', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['active', 'index', 'disabled'] })
export class SuperTabButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(SuperTabButton, ['active', 'index', 'disabled']);

export declare interface SuperTabs extends StencilComponents<'SuperTabs'> {}
@Component({ selector: 'super-tabs', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['config', 'activeTabIndex'] })
export class SuperTabs {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyMethods(SuperTabs, ['selectTab']);
proxyInputs(SuperTabs, ['config', 'activeTabIndex']);

export declare interface SuperTabsContainer extends StencilComponents<'SuperTabsContainer'> {}
@Component({ selector: 'super-tabs-container', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['config', 'swipeEnabled'] })
export class SuperTabsContainer {
  stTabsChange!: EventEmitter<CustomEvent>;
  activeTabChange!: EventEmitter<CustomEvent>;
  activeTabIndexChange!: EventEmitter<CustomEvent>;
  selectedTabIndexChange!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['stTabsChange', 'activeTabChange', 'activeTabIndexChange', 'selectedTabIndexChange']);
  }
}
proxyMethods(SuperTabsContainer, ['moveContainerByIndex', 'moveContainer']);
proxyInputs(SuperTabsContainer, ['config', 'swipeEnabled']);

export declare interface SuperTabsToolbar extends StencilComponents<'SuperTabsToolbar'> {}
@Component({ selector: 'super-tabs-toolbar', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['toolbarPosition', 'config', 'showIndicator', 'color'] })
export class SuperTabsToolbar {
  buttonClick!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['buttonClick']);
  }
}
proxyMethods(SuperTabsToolbar, ['onButtonClick', 'setActiveTab', 'setSelectedTab']);
proxyInputs(SuperTabsToolbar, ['toolbarPosition', 'config', 'showIndicator', 'color']);
