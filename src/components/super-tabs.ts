import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';

import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  App,
  DeepLinker,
  DomController,
  NavController,
  NavControllerBase,
  Platform,
  RootNode,
  ViewController
} from 'ionic-angular';
import { DIRECTION_SWITCH } from 'ionic-angular/navigation/nav-util';
import { NavigationContainer } from 'ionic-angular/navigation/navigation-container';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SuperTabsController } from '../providers/super-tabs-controller';
import { SuperTabComponent } from './super-tab';
import { SuperTabsContainer } from './super-tabs-container';
import { SuperTabsToolbar } from './super-tabs-toolbar';

export interface SuperTabsConfig {
  /**
   * Defaults to 40
   */
  maxDragAngle?: number;
  /**
   * Defaults to 20
   */
  dragThreshold?: number;
  /**
   * Allows elements inside tabs to be dragged, defaults to false
   */
  allowElementScroll?: boolean;
  /**
   * Defaults to ease-in-out
   */
  transitionEase?: string;
  /**
   * Defaults to 150
   */
  transitionDuration?: number;
  /**
   * Defaults to none
   */
  sideMenu?: 'left' | 'right' | 'both';
  /**
   * Defaults to 50
   */
  sideMenuThreshold?: number;

  /**
   * Defaults to 300
   */
  shortSwipeDuration?: number;
}

@Component({
  selector: 'super-tabs',
  template: `
    <super-tabs-toolbar [tabsPlacement]="tabsPlacement" [hidden]="!_isToolbarVisible" [config]="config"
                        [color]="toolbarBackground"
                        [tabsColor]="toolbarColor" [indicatorColor]="indicatorColor" [badgeColor]="badgeColor"
                        [scrollTabs]="scrollTabs"
                        [selectedTab]="selectedTabIndex"
                        (tabSelect)="onToolbarTabSelect($event)"></super-tabs-toolbar>
    <super-tabs-container [config]="config" [tabsCount]="_tabs.length" [selectedTabIndex]="selectedTabIndex"
                          (tabSelect)="onContainerTabSelect($event)" (onDrag)="onDrag()" (onDragStart)="tabDragStart.emit()" (onDragEnd)="tabDragEnd.emit()">
      <ng-content></ng-content>
    </super-tabs-container>
  `,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: RootNode,
      useExisting: forwardRef(() => SuperTabsComponent)
    }
  ]
})
export class SuperTabsComponent
  implements
    OnInit,
    AfterContentInit,
    AfterViewInit,
    OnDestroy,
    RootNode,
    NavigationContainer {
  /**
   * Color of the toolbar behind the tab buttons
   */
  @Input() toolbarBackground: string;

  /**
   * Color of the tab buttons' text and/or icon
   */
  @Input() toolbarColor: string;

  /**
   * Color of the slider that moves based on what tab is selected
   */
  @Input() indicatorColor = 'primary';

  /**
   * Badge color
   */
  @Input() badgeColor = 'primary';

  /**
   * Configuration
   */
  @Input() config: SuperTabsConfig = {};

  /**
   * Tabs instance ID
   */
  @Input() id: string;

  @Input() name: string;


  /**
   * Allow Ionic NavController lifecycle events to pass through to child tabs
   */
  @Input() passthroughLifecycle: boolean;

  /**
   * Height of the tabs
   */
  @Input()
  set height(val: number) {
    this.rnd.setStyle(this.el.nativeElement, 'height', val + 'px');
  }

  get height(): number {
    return this.el.nativeElement.offsetHeight;
  }

  /**
   * The initial selected tab index
   * @param val {number} tab index
   */
  @Input()
  set selectedTabIndex(val: number) {
    this._selectedTabIndex = Number(val);
    this.init && this.alignIndicatorPosition(true);
  }

  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  /**
   * Set to true to enable tab buttons scrolling
   * @param val
   */
  @Input()
  set scrollTabs(val: boolean) {
    this._scrollTabs = typeof val !== 'boolean' || val === true;
  }

  get scrollTabs() {
    return this._scrollTabs;
  }

  /**
   * Tab buttons placement. Can be `top` or `bottom`.
   * @type {string}
   */
  @Input() tabsPlacement = 'top';

  /**
   * Emits event when tab dragging is activated
   */
  @Output()
  tabDragStart: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Emits event when tab dragging is stopped (when a user lets go)
   */
  @Output()
  tabDragEnd: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Emits the tab index when the selected tab changes
   * @type {EventEmitter<Object>}
   */
  @Output() tabSelect: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Indicates whether the toolbar is visible
   * @private
   */
  _isToolbarVisible = true;

  /**
   * @private
   */
  _tabs: SuperTabComponent[] = [];

  @ViewChild(SuperTabsToolbar) private toolbar: SuperTabsToolbar;

  @ViewChild(SuperTabsContainer) private tabsContainer: SuperTabsContainer;

  private maxIndicatorPosition: number;

  /**
   * Indicates whether the tab buttons should scroll
   * @type {boolean}
   * @private
   */
  private _scrollTabs = false;

  /**
   * Selected tab index
   * @type {number}
   * @private
   */
  private _selectedTabIndex = 0;

  /**
   * Any observable subscriptions that we should unsubscribe from when destroying this component
   * @type {Array<Subscription>}
   * @private
   */
  private watches: Subscription[] = [];

  /**
   * Indicates whether any of the tabs has an icon
   * @type {boolean}
   * @private
   */
  private hasIcons = false;

  /**
   * Indicates whether any of the tabs has a title
   * @type {boolean}
   * @private
   */
  private hasTitles = false;

  /**
   * Indicates whether the component has finished initializing
   * @type {boolean}
   * @private
   */
  private init = false;

  /**
   * Parent NavController
   * @type {NavControllerBase}
   */
  parent: NavControllerBase;

  constructor(
    @Optional() parent: NavController,
    @Optional() public viewCtrl: ViewController,
    private _app: App,
    private el: ElementRef,
    private rnd: Renderer2,
    private superTabsCtrl: SuperTabsController,
    private linker: DeepLinker,
    private domCtrl: DomController,
    private _plt: Platform
  ) {
    this.parent = <NavControllerBase>parent;

    if (this.parent) {
      this.parent.registerChildNav(this);
    } else if (viewCtrl && viewCtrl.getNav()) {
      this.parent = <any>viewCtrl.getNav();
      this.parent.registerChildNav(this);
    } else if (this._app) {
      this._app.registerRootNav(this);
    }

    const obsToMerge: Observable<any>[] = [
      Observable.fromEvent(window, 'orientationchange'),
      Observable.fromEvent(window, 'resize')
    ];

    if (viewCtrl) {
      obsToMerge.push(viewCtrl.didEnter);
      // This causes lifecycle events to be passed through to the active tab
    }

    // re-adjust the height of the slider when the orientation changes
    const $windowResize = Observable.merge
      .apply(this, obsToMerge)
      .debounceTime(100);

    const windowResizeSub = $windowResize.subscribe(() => {
      this.resize();
    });

    this.watches.push(windowResizeSub);
  }

  ngOnInit() {
    const defaultConfig: SuperTabsConfig = {
      dragThreshold: 10,
      allowElementScroll: false,
      maxDragAngle: 40,
      sideMenuThreshold: 50,
      transitionDuration: 300,
      transitionEase: 'cubic-bezier(0.35, 0, 0.25, 1)',
      shortSwipeDuration: 300
    };

    for (let prop in this.config) {
      defaultConfig[prop] = this.config[prop];
    }

    this.config = defaultConfig;

    if (this.config.allowElementScroll === true) {
      if (this.config.dragThreshold < 110) {
        this.config.dragThreshold = 110;
      }
    }

    this.id = this.id || `super-tabs-${++superTabsIds}`;
    this.superTabsCtrl.registerInstance(this);

    if (this.tabsPlacement === 'bottom') {
      this.rnd.addClass(
        this.getElementRef().nativeElement,
        'tabs-placement-bottom'
      );
    }

    if(this.passthroughLifecycle && this.viewCtrl) {
      this.viewCtrl.willEnter.subscribe(() => {
        this.fireLifecycleEvent(['willEnter']);
      });
      this.viewCtrl.didEnter.subscribe(() => {
        this.fireLifecycleEvent(['didEnter']);
      });
      this.viewCtrl.willLeave.subscribe(() => {
        this.fireLifecycleEvent(['willLeave']);
      });
      this.viewCtrl.didLeave.subscribe(() => {
        this.fireLifecycleEvent(['didLeave']);
      });
    }
  }

  ngAfterContentInit() {
    this.updateTabWidth();
    this.toolbar.tabs = this._tabs;
  }

  async ngAfterViewInit() {
    const tabsSegment = this.linker.getSegmentByNavIdOrName(this.id, this.name);

    if (tabsSegment) {
      this.selectedTabIndex = this.getTabIndexById(tabsSegment.id);
    }

    this.linker.navChange(DIRECTION_SWITCH);

    if (!this.hasTitles && !this.hasIcons) {
      this._isToolbarVisible = false;
    }

    this.tabsContainer.slideTo(this.selectedTabIndex, false);
    await this.refreshTabStates();
    this.fireLifecycleEvent(['willEnter', 'didEnter']);

    this.setFixedIndicatorWidth();

    // we need this to make sure the "slide" thingy doesn't move outside the screen
    this.setMaxIndicatorPosition();

    setTimeout(() => this.alignIndicatorPosition(), 100);

    this.refreshContainerHeight();

    this.init = true;
  }

  ngOnDestroy() {
    this.watches.forEach((watch: Subscription) => {
      watch.unsubscribe && watch.unsubscribe();
    });

    this.parent.unregisterChildNav(this);

    this.superTabsCtrl.unregisterInstance(this.id);
  }

  getType(): string {
    return;
  }

  getSecondaryIdentifier(): string {
    return;
  }

  getAllChildNavs(): any[] {
    return this._tabs;
  }

  resize() {
    if (this.el.nativeElement.offsetParent === null) {
      return;
    }
    this.setMaxIndicatorPosition();
    this.updateTabWidth();
    this.setFixedIndicatorWidth();
    this.refreshTabWidths();
    this.tabsContainer.refreshDimensions();
    this.tabsContainer.slideTo(this.selectedTabIndex);
    this.alignIndicatorPosition();
    this.refreshContainerHeight();
  }

  /**
   * Sets the badge number for a specific tab
   * @param tabId {string} tab ID
   * @param value {number} badge number
   */
  setBadge(tabId: string, value: number) {
    this.getTabById(tabId).setBadge(value);
  }

  /**
   * Clears the badge for a specific tab
   * @param tabId {string} tab ID
   */
  clearBadge(tabId: string) {
    this.getTabById(tabId).clearBadge();
  }

  /**
   * Increases the badge value for a specific tab
   * @param tabId {string} tab ID
   * @param increaseBy {number} the number to increase by
   */
  increaseBadge(tabId: string, increaseBy: number) {
    this.getTabById(tabId).increaseBadge(increaseBy);
  }

  decreaseBadge(tabId: string, decreaseBy: number) {
    this.getTabById(tabId).decreaseBadge(decreaseBy);
  }

  enableTabsSwipe(enable: boolean) {
    this.tabsContainer.enableTabsSwipe(enable);
  }

  enableTabSwipe(tabId: string, enable: boolean) {
    this.tabsContainer.enableTabSwipe(this.getTabIndexById(tabId), enable);
  }

  showToolbar(show: boolean) {
    this._isToolbarVisible = show;
    this.refreshContainerHeight();
  }

  slideTo(indexOrId: string | number, fireEvent: boolean = true) {
    typeof indexOrId === 'string' &&
      (indexOrId = this.getTabIndexById(indexOrId));
    fireEvent && this.onToolbarTabSelect(indexOrId);
  }

  getActiveChildNavs(): NavigationContainer[] {
    if (this.selectedTabIndex < 0) {
      this.selectedTabIndex = 0;
    }
    
    return [this._tabs[this.selectedTabIndex]];
  }

  addTab(tab: SuperTabComponent) {
    tab.rootNavCtrl = this.parent;
    tab.rootParams = tab.rootParams || {};

    tab.tabId = tab.tabId || `super-tabs-${this.id}-tab-${this._tabs.length}`;

    this._tabs.push(tab);

    if (tab.icon) {
      this.hasIcons = true;
    }

    if (tab.title) {
      this.hasTitles = true;
    }

    tab.setWidth(this.el.nativeElement.offsetWidth);
  }

  /**
   * We listen to drag events to move the "slide" thingy along with the slides
   */
  onDrag() {
    if (!this._isToolbarVisible) {
      return;
    }

    this.domCtrl.write(() => {
      const singleSlideWidth = this.tabsContainer.tabWidth,
        slidesWidth = this.tabsContainer.containerWidth;

      let percentage = Math.abs(
        this.tabsContainer.containerPosition / slidesWidth
      );

      if (this.scrollTabs) {
        const originalSlideStart = singleSlideWidth * this.selectedTabIndex,
          originalPosition = this.getRelativeIndicatorPosition(),
          originalWidth = this.getSegmentButtonWidth();

        let nextPosition: number,
          nextWidth: number,
          indicatorPosition: number,
          indicatorWidth: number;

        const deltaTabPos =
          originalSlideStart - Math.abs(this.tabsContainer.containerPosition);

        percentage = Math.abs(deltaTabPos / singleSlideWidth);

        if (deltaTabPos < 0) {
          // going to next slide
          nextPosition = this.getRelativeIndicatorPosition(
            this.selectedTabIndex + 1
          );
          nextWidth = this.getSegmentButtonWidth(this.selectedTabIndex + 1);
          indicatorPosition =
            originalPosition + percentage * (nextPosition - originalPosition);
        } else {
          // going to previous slide
          nextPosition = this.getRelativeIndicatorPosition(
            this.selectedTabIndex - 1
          );
          nextWidth = this.getSegmentButtonWidth(this.selectedTabIndex - 1);
          indicatorPosition =
            originalPosition - percentage * (originalPosition - nextPosition);
        }

        const deltaWidth: number = nextWidth - originalWidth;
        indicatorWidth = originalWidth + percentage * deltaWidth;

        if (
          (originalWidth > nextWidth && indicatorWidth < nextWidth) ||
          (originalWidth < nextWidth && indicatorWidth > nextWidth)
        ) {
          // this is only useful on desktop, because you are able to drag and swipe through multiple tabs at once
          // which results in the indicator width to be super small/big since it's changing based on the current/next widths
          indicatorWidth = nextWidth;
        }

        this.alignTabButtonsContainer();
        this.toolbar.setIndicatorProperties(indicatorWidth, indicatorPosition);
      } else {
        this.toolbar.setIndicatorPosition(
          Math.min(percentage * singleSlideWidth, this.maxIndicatorPosition)
        );
      }
    });
  }

  /**
   * Runs when the user clicks on a segment button
   * @param index
   */
  async onTabChange(index: number) {
    index = Number(index);
    if (index === this.selectedTabIndex) {
      this.tabSelect.emit({
        index,
        id: this._tabs[index].tabId,
        changed: false
      });
      return;
    }

    if (index <= this._tabs.length) {
      this.fireLifecycleEvent(['willLeave', 'didLeave']);

      this.selectedTabIndex = index;

      this.linker.navChange(DIRECTION_SWITCH);

      await this.refreshTabStates();

      this.fireLifecycleEvent(['willEnter', 'didEnter']);

      this.tabSelect.emit({
        index,
        id: this._tabs[index].tabId,
        changed: true
      });
    }
  }

  onToolbarTabSelect(index: number) {
    if (index !== this.selectedTabIndex) {
      this.tabsContainer.slideTo(index);
    }
    return this.onTabChange(index);
  }

  async onContainerTabSelect(ev: { index: number; changed: boolean }) {
    if (ev.changed) {
      await this.onTabChange(ev.index);
    }
    this.alignIndicatorPosition(true);
  }

  private fireLifecycleEvent(events: string[]) {
    const activeView = this.getActiveTab().getActive();
    if (activeView) {
      events.forEach((event: string) => {
        switch (event) {
          case 'willEnter':
            activeView._willEnter();
            break;
          case 'didEnter':
            activeView._didEnter();
            break;
          case 'willLeave':
            activeView._willLeave(false);
            break;
          case 'didLeave':
            activeView._didLeave();
            break;
        }
      });  
    }
  }

  private refreshTabStates() {
    return Promise.all(
      this._tabs.map((tab, i) => {
        tab.setActive(i === this.selectedTabIndex);

        return tab.load(Math.abs(this.selectedTabIndex - i) < 2);
      })
    );
  }

  private updateTabWidth() {
    this.tabsContainer.tabWidth = this.el.nativeElement.offsetWidth;
  }

  private refreshContainerHeight() {
    const heightOffset = this._isToolbarVisible ? this.toolbar.height : 0;

    this.rnd.setStyle(
      this.tabsContainer.getNativeElement(),
      'height',
      `calc(100% - ${heightOffset}px)`
    );
  }

  private refreshTabWidths() {
    const width: number = this.el.nativeElement.offsetWidth;
    this._tabs.forEach((tab: SuperTabComponent) => tab.setWidth(width));
  }

  private alignTabButtonsContainer(animate?: boolean) {
    const mw: number = this.el.nativeElement.offsetWidth, // max width
      iw: number = this.toolbar.indicatorWidth, // indicator width
      ip: number = this.toolbar.indicatorPosition, // indicatorPosition
      sp: number = this.toolbar.segmentPosition; // segment position

    if (mw === 0) {
      return;
    }

    if (this.toolbar.segmentWidth <= mw) {
      if (this.toolbar.segmentPosition !== 0) {
        this.toolbar.setSegmentPosition(0, animate);
      }
      return;
    }

    let pos;
    if (ip + iw + (mw / 2 - iw / 2) > mw + sp) {
      // we need to move the segment container to the left
      const delta: number = ip + iw + (mw / 2 - iw / 2) - mw - sp,
        max: number = this.toolbar.segmentWidth - mw;

      pos = sp + delta;
      pos = pos < max ? pos : max;
    } else if (ip - (mw / 2 - iw / 2) < sp) {
      // we need to move the segment container to the right
      pos = ip - (mw / 2 - iw / 2);
      // pos = pos >= 0? pos : 0;
      pos = pos < 0 ? 0 : pos > ip ? ip - mw + iw : pos;
      // pos = pos < 0? 0 : pos > maxPos? maxPos : pos;
    } else {
      // no need to move the segment container
      return;
    }

    this.toolbar.setSegmentPosition(pos, animate);
  }

  private getRelativeIndicatorPosition(
    index: number = this.selectedTabIndex
  ): number {
    let position = 0;
    for (let i = 0; i < this.toolbar.segmentButtonWidths.length; i++) {
      if (index > Number(i)) {
        position += this.toolbar.segmentButtonWidths[i];
      }
    }
    return position;
  }

  private getAbsoluteIndicatorPosition(): number {
    const position =
      (this.selectedTabIndex * this.tabsContainer.tabWidth) / this._tabs.length;
    return position <= this.maxIndicatorPosition
      ? position
      : this.maxIndicatorPosition;
  }

  /**
   * Gets the width of a tab button when `scrollTabs` is set to `true`
   */
  private getSegmentButtonWidth(index: number = this.selectedTabIndex): number {
    if (!this._isToolbarVisible) {
      return;
    }
    return this.toolbar.segmentButtonWidths[index];
  }

  private setMaxIndicatorPosition() {
    if (this.el && this.el.nativeElement) {
      this.maxIndicatorPosition =
        this.el.nativeElement.offsetWidth -
        this.el.nativeElement.offsetWidth / this._tabs.length;
    }
  }

  private setFixedIndicatorWidth() {
    if (this.scrollTabs || !this._isToolbarVisible) {
      return;
    }
    // the width of the "slide", should be equal to the width of a single `ion-segment-button`
    // we'll just calculate it instead of querying for a segment button
    this.toolbar.setIndicatorWidth(
      this.el.nativeElement.offsetWidth / this._tabs.length,
      false
    );
  }

  /**
   * Aligns slide position with selected tab
   */
  private alignIndicatorPosition(animate: boolean = false) {
    if (!this._isToolbarVisible) {
      return;
    }

    if (this.scrollTabs) {
      this.toolbar.alignIndicator(
        this.getRelativeIndicatorPosition(),
        this.getSegmentButtonWidth(),
        animate
      );
      this.alignTabButtonsContainer(animate);
    } else {
      this.toolbar.setIndicatorPosition(
        this.getAbsoluteIndicatorPosition(),
        animate
      );
    }
  }

  private tabDragStarted() {
    this.tabDragStart.emit();
  }

  private tabDragStopped() {
    this.tabDragEnd.emit();
  }

  getTabIndexById(tabId: string): number {
    return this._tabs.findIndex((tab: SuperTabComponent) => tab.tabId === tabId);
  }

  getTabById(tabId: string): SuperTabComponent {
    return this._tabs.find((tab: SuperTabComponent) => tab.tabId === tabId);
  }

  getActiveTab(): SuperTabComponent {
    return this._tabs[this.selectedTabIndex];
  }

  // needed since we're implementing RootNode
  getElementRef() {
    return this.el;
  }

  // needed since we're implementing RootNode
  initPane() {
    return true;
  }

  // needed since we're implementing RootNode
  paneChanged() {}

  // needed to make Ionic Framework think this is a tabs component... needed for Deeplinking
  getSelected() {}

  // needed to make Ionic Framework think this is a tabs component... needed for Deeplinking
  setTabbarPosition() {}

  // update segment button widths manually
  indexSegmentButtonWidths() {
    this._plt.raf(() => this.toolbar.indexSegmentButtonWidths());
  }
}

let superTabsIds = -1;
