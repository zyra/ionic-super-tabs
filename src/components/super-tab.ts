import {
  Component, Input, Renderer, ElementRef, ViewEncapsulation, Optional, ComponentFactoryResolver,
  NgZone, ViewContainerRef, ViewChild, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ErrorHandler
} from '@angular/core';
import {
  NavControllerBase, App, Config, Platform, GestureController, DeepLinker, DomController, NavOptions,
  ViewController
} from 'ionic-angular';
import { TransitionController } from 'ionic-angular/transitions/transition-controller';
import { SuperTabs } from './super-tabs';

@Component({
  selector: 'super-tab',
  template: '<div #viewport></div><div class="nav-decor"></div>',
  encapsulation: ViewEncapsulation.None
})
export class SuperTab extends NavControllerBase implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Title of the tab
   */
  @Input()
  title: string;

  // TODO find less hacky approach
  // needed to make Ionic Framework think this is a tabs component... needed for Deeplinking
  get tabTitle() {
    return this.title;
  }

  // needed to make Ionic Framework think this is a tabs component... needed for Deeplinking
  get index() {
    return this.parent.getTabIndexById(this.tabId);
  }

  /**
   * Name of the ionicon to use
   */
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

  get _tabId() {
    return this.tabId;
  }

  /**
   * Badge value
   * @type {Number}
   */
  @Input()
  badge: number;


  /**
   * Enable/disable swipe to go back for iOS
   * @return {boolean}
   */
  @Input()
  get swipeBackEnabled(): boolean {
    return this._sbEnabled;
  }
  set swipeBackEnabled(val: boolean) {
    this._sbEnabled = Boolean(val);
    this._swipeBackCheck();
  }

  /**
   * @hidden
   */
  @ViewChild('viewport', {read: ViewContainerRef})
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  /**
   * Indicates whether the tab has been loaded
   * @type {boolean}
   */
  private loaded: boolean = false;

  /**
   * A promise that resolves when the component has initialized
   */
  private init: Promise<any>;

  /**
   * Function to call to resolve the init promise
   */
  private initResolve: Function;

  constructor(
    parent: SuperTabs,
    app: App,
    config: Config,
    plt: Platform,
    el: ElementRef,
    zone: NgZone,
    rnd: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    errorHandler: ErrorHandler,
    @Optional() private linker: DeepLinker,
    private _dom: DomController,
    private cd: ChangeDetectorRef
  ) {
    super(parent, app, config, plt, el, zone, rnd, cfr, gestureCtrl, transCtrl, linker, _dom, errorHandler);
    this.init = new Promise<void>(resolve => this.initResolve = resolve);
  }

  _didEnter(view: ViewController) {
    if (this.loaded) {
      super._didEnter(view);
    }
  }

  _willEnter(view: ViewController) {
    if (this.loaded) {
      super._willEnter(view);
    }
  }

  ngOnInit() {
    this.parent.addTab(this);
  }

  ngAfterViewInit() {
    this.initResolve();
  }

  ngOnDestroy() {
    this.destroy();
  }

  setActive(active: boolean) {
    if (active) {
      this.cd.reattach();
      this.cd.detectChanges();
    } else if (!active) {
      this.cd.detach();
    }
  }

  async load(load: boolean) {
    if (load && !this.loaded) {
      await this.init;
      await this.push(this.root, this.rootParams, { animate: false });
      this.loaded = true;
    }
  }

  setBadge(value: number) {
    this.badge = value;
  }

  clearBadge() {
    delete this.badge;
  }

  increaseBadge(increaseBy: number = 1) {
    this.badge += increaseBy;
  }

  decreaseBadge(decreaseBy: number = 1) {
    this.badge = Math.max(0, this.badge - decreaseBy);
  }

  setWidth(width: number) {
    this.setElementStyle('width', width + 'px');
  }

  goToRoot(opts: NavOptions): Promise<any> {
    return this.setRoot(this.root, this.rootParams, opts, null);
  }

}
