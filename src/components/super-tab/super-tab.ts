import {
  Component, Input, Renderer, ElementRef, ViewEncapsulation, Optional, ComponentFactoryResolver,
  NgZone, ViewContainerRef, ViewChild, OnInit, AfterViewInit, OnDestroy
} from '@angular/core';
import { NavControllerBase, App, Config, Platform, Keyboard, GestureController, DeepLinker, DomController } from 'ionic-angular';
import { TransitionController } from 'ionic-angular/transitions/transition-controller';
import { SuperTabs } from '../super-tabs/super-tabs';

@Component({
  selector: 'super-tab',
  template: '<div #viewport></div><div class="nav-decor"></div>',
  encapsulation: ViewEncapsulation.None
})
export class SuperTab extends NavControllerBase implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  title: string;

  @Input()
  icon: string;

  /**
   * @input {Page} Set the root page for this tab.
   */
  @Input() root: any;

  /**
   * @input {object} Any nav-params to pass to the root page of this tab.
   */
  @Input() rootParams: any;

  @Input('id')
  tabId: string;

  @Input()
  badge: number = 0;

  /**
   * @hidden
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  _loaded: boolean = false;

  constructor(
    parent: SuperTabs,
    app: App,
    config: Config,
    plt: Platform,
    keyboard: Keyboard,
    el: ElementRef,
    zone: NgZone,
    rnd: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    @Optional() private linker: DeepLinker,
    private _dom: DomController
  ) {
    super(parent, app, config, plt, keyboard, el, zone, rnd, cfr, gestureCtrl, transCtrl, linker, _dom);
  }

  ngOnInit() {
    this.parent.addTab(this);
  }

  ngAfterViewInit() {
    this.push(this.root, this.rootParams);
  }

  ngOnDestroy() {
    this.destroy();
  }

  setBadge(value: number) {
    this.badge = value;
  }

  clearBadge() {
    this.badge = 0;
  }

  increaseBadge(increaseBy: number) {
    this.badge += increaseBy;
  }

  decreaseBadge(decreaseBy: number) {
    this.badge = Math.max(0, this.badge - decreaseBy);
  }

  setWidth(width: number) {
    this.setElementStyle('width', width + 'px');
  }

  getActiveChildNav() {
    return null;
  }

}
