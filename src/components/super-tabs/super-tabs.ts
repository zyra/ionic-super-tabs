import {
  AfterViewInit, Component, ElementRef, Input, OnInit, OnDestroy, Renderer2,
  ViewChild, AfterContentInit, Output, EventEmitter, ViewEncapsulation, forwardRef, Optional
} from '@angular/core';
import { SuperTab } from '../super-tab/super-tab';
import {NavController, RootNode, NavControllerBase, ViewController, App, DeepLinker} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SuperTabsToolbar } from '../super-tabs-toolbar/super-tabs-toolbar';
import { SuperTabsContainer } from '../super-tabs-container/super-tabs-container';
import { SuperTabsController } from '../../providers/super-tabs-controller';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';

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
  sideMenu?: 'left' | 'right' | 'both',
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
    <super-tabs-toolbar [tabsPlacement]="tabsPlacement" [hidden]="!isToolbarVisible" [config]="config" [color]="toolbarBackground"
                        [tabsColor]="toolbarColor" [indicatorColor]="indicatorColor" [badgeColor]="badgeColor"
                        [scrollTabs]="scrollTabs"
                        [selectedTab]="selectedTabIndex"
                        (tabSelect)="onToolbarTabSelect($event)"></super-tabs-toolbar>
    <super-tabs-container [config]="config" [tabsCount]="tabs.length" [selectedTabIndex]="selectedTabIndex"
                          (tabSelect)="onContainerTabSelect($event)" (onDrag)="onDrag($event)" (tabDidChange)="onSlideDidChange($event)">
      <ng-content></ng-content>
    </super-tabs-container>
  `,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: RootNode, useExisting: forwardRef(() => SuperTabs) }]
})
export class SuperTabs implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, RootNode {

  /**
   * Color of the toolbar behind the tab buttons
   */
  @Input()
  toolbarBackground: string;

  /**
   * Color of the tab buttons' text and/or icon
   */
  @Input()
  toolbarColor: string;

  /**
   * Color of the slider that moves based on what tab is selected
   */
  @Input()
  indicatorColor: string = 'primary';

  /**
   * Badge color
   */
  @Input()
  badgeColor: string = 'primary';

  /**
   * Configuration
   */
  @Input()
  config: SuperTabsConfig = {};

  /**
   * Tabs instance ID
   */
  @Input()
  id: string;

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

  @Input()
  set scrollTabs(val: boolean) {
    this._scrollTabs = typeof val !== 'boolean' || val === true;
  }

  get scrollTabs() {
    return this._scrollTabs;
  }

  @Input()
  tabsPlacement: string = 'top';

  @Output()
  tabSelect: EventEmitter<any> = new EventEmitter<any>();

  // View bindings
  isToolbarVisible: boolean = true;

  /**
   * @private
   */
  tabs: SuperTab[] = [];

  @ViewChild(SuperTabsToolbar)
  private toolbar: SuperTabsToolbar;

  @ViewChild(SuperTabsContainer)
  private tabsContainer: SuperTabsContainer;

  private maxIndicatorPosition: number;

  private _scrollTabs: boolean = false;

  private _selectedTabIndex: number = 0;

  private watches: Subscription[] = [];

  private hasIcons: boolean = false;

  private hasTitles: boolean = false;

  private init: boolean = false;

  parent: NavControllerBase;

  constructor(
    @Optional() parent: NavController,
    @Optional() public viewCtrl: ViewController,
    private _app: App,
    private el: ElementRef,
    private rnd: Renderer2,
    private superTabsCtrl: SuperTabsController,
    private linker: DeepLinker
  ) {

    this.parent = <NavControllerBase>parent;

    if (this.parent) {
      console.log('haz root nav controller');
      this.parent.registerChildNav(this);
    } else if(viewCtrl && viewCtrl.getNav()) {
      console.log('in modal');
      this.parent = <any>viewCtrl.getNav();
      this.parent.registerChildNav(this);
    } else if (this._app) {
      console.log('root nav');
      this._app._setRootNav(this);
    }

    if (viewCtrl) {
      viewCtrl._setContent(this);
      viewCtrl._setContentRef(el);
    }

    // re-adjust the height of the slider when the orientation changes
    this.watches.push(Observable.merge(Observable.fromEvent(window, 'orientationchange'), Observable.fromEvent(window, 'resize'))
      .debounceTime(10)
      .subscribe(() => {

        this.updateTabWidth();
        this.setFixedIndicatorWidth();
        this.tabsContainer.refreshDimensions();
        this.tabsContainer.slideTo(this.selectedTabIndex);
        this.alignIndicatorPosition();
        this.refreshTabWidths();

        this.refreshContainerHeight();

      }));


  }

  ngOnInit() {

    const defaultConfig: SuperTabsConfig = {
      dragThreshold: 20,
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

    this.id = this.id || `super-tabs-${++superTabsIds}`;
    this.superTabsCtrl.registerInstance(this);

    if (this.tabsPlacement === 'bottom') {
      this.rnd.addClass(this.getElementRef().nativeElement, 'tabs-placement-bottom');
    }

  }

  ngAfterContentInit() {

    this.updateTabWidth();

    this.toolbar.tabs = this.tabs;

  }

  ngAfterViewInit() {

    const tabsSegment = this.linker.initNav(this);

    if (tabsSegment && !tabsSegment.component) {
      this.selectedTabIndex = this.tabs.findIndex((tab: SuperTab) => tab.root === tabsSegment.name);
    }

    this.linker.navChange('switch');

    if (!this.hasTitles && !this.hasIcons) this.isToolbarVisible = false;

    this.tabsContainer.slideTo(this.selectedTabIndex);

    this.setFixedIndicatorWidth();

    // we need this to make sure the "slide" thingy doesn't move outside the screen
    this.maxIndicatorPosition = this.el.nativeElement.offsetWidth - (this.el.nativeElement.offsetWidth / this.tabs.length);

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

  setBadge(tabId: string, value: number) {
    this.getTabById(tabId).setBadge(value);
  }

  clearBadge(tabId: string) {
    this.getTabById(tabId).clearBadge();
  }

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
    this.isToolbarVisible = show;
    this.refreshContainerHeight();
  }

  slideTo(indexOrId: string | number) {
    if (typeof indexOrId === 'string') {
      indexOrId = this.getTabIndexById(indexOrId);
    }

    this.selectedTabIndex = indexOrId;
    this.tabsContainer.slideTo(indexOrId);
  }

  getActiveChildNav() {
    return this.tabs[this.selectedTabIndex];
  }

  addTab(tab: SuperTab) {

    tab.rootParams = tab.rootParams || {};
    tab.rootParams.rootNavCtrl = this.parent;

    tab.tabId = tab.tabId || `super-tabs-${this.id}-tab-${this.tabs.length}`;

    this.tabs.push(tab);

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

    if (!this.isToolbarVisible) return;

    const singleSlideWidth = this.tabsContainer.tabWidth,
      slidesWidth = this.tabsContainer.containerWidth;

    let percentage = Math.abs(this.tabsContainer.containerPosition / slidesWidth);

    if (this.scrollTabs) {

      const originalSlideStart = singleSlideWidth * this.selectedTabIndex,
        originalPosition = this.getRelativeIndicatorPosition(),
        originalWidth = this.getSegmentButtonWidth();

      let nextPosition: number, nextWidth: number, position: number, indicatorWidth: number;

      const deltaTabPos = originalSlideStart - Math.abs(this.tabsContainer.containerPosition);

      percentage = Math.abs(deltaTabPos / singleSlideWidth);

      if (deltaTabPos < 0) {

        // going to next slide
        nextPosition = this.getRelativeIndicatorPosition(this.selectedTabIndex + 1);
        nextWidth = this.getSegmentButtonWidth(this.selectedTabIndex + 1);

        position = originalPosition + percentage * (nextPosition - originalPosition);

      } else {

        // going to previous slide
        nextPosition = this.getRelativeIndicatorPosition(this.selectedTabIndex - 1);
        nextWidth = this.getSegmentButtonWidth(this.selectedTabIndex - 1);
        position = originalPosition - percentage * (originalPosition - nextPosition);

      }

      const deltaWidth: number = nextWidth - originalWidth;
      indicatorWidth = originalWidth + percentage * deltaWidth;

      if ((originalWidth > nextWidth && indicatorWidth < nextWidth) || (originalWidth < nextWidth && indicatorWidth > nextWidth)) {
        // this is only useful on desktop, because you are able to drag and swipe through multiple tabs at once
        // which results in the indicator width to be super small/big since it's changing based on the current/next widths
        indicatorWidth = nextWidth;
      }

      this.alignTabButtonsContainer();
      this.toolbar.alignIndicator(position, indicatorWidth);

    } else {

      this.toolbar.setIndicatorPosition(Math.min(percentage * singleSlideWidth, this.maxIndicatorPosition));

    }
  }

  /**
   * We need to disable animation after the slide is done changing
   * Any further movement should happen instantly as the user swipes through the tabs
   */
  onSlideDidChange() {
    this.tabSelect.emit(this.selectedTabIndex);
  }

  /**
   * Runs when the user clicks on a segment button
   * @param index
   */
  onTabChange(index: number) {
    if (index <= this.tabs.length) {
      this.tabs[this.selectedTabIndex].getActive()._didLeave();
      this.tabs[index].getActive()._didEnter();
      this.selectedTabIndex = index;

      this.linker.navChange('switch');

      this.tabSelect.emit({
        index,
        id: this.tabs[index].tabId
      });

    }
  }

  onToolbarTabSelect(index: number) {
    this.tabsContainer.slideTo(index);
    this.onTabChange(index);
  }

  onContainerTabSelect(ev: {index: number; changed: boolean}) {
    if (ev.changed) {
      this.onTabChange(ev.index);
    }
    this.alignIndicatorPosition(true);
  }

  private updateTabWidth() {
    this.tabsContainer.tabWidth = this.el.nativeElement.offsetWidth;
  }

  private refreshContainerHeight() {
    let heightOffset: number = 0;

    if (this.isToolbarVisible) {
      heightOffset -= 4;
      this.hasTitles && (heightOffset += 40);
      this.hasIcons && (heightOffset += 40);
    }

    this.rnd.setStyle(this.tabsContainer.getNativeElement(), 'height', `calc(100% - ${heightOffset}px)`);
  }

  private refreshTabWidths() {
    const width: number = this.el.nativeElement.offsetWidth;
    this.tabs.forEach((tab: SuperTab) => {
      tab.setWidth(width);
    });
  }

  private alignTabButtonsContainer(ease?: boolean) {

    const mw: number = this.el.nativeElement.offsetWidth, // max width
      iw: number = this.toolbar.indicatorWidth, // indicator width
      ip: number = this.toolbar.indicatorPosition, // indicatorPosition
      sp: number = this.toolbar.segmentPosition; // segment position

    let pos;

    if (ip + iw + (mw / 2 - iw / 2) > mw + sp) {
      // we need to move the segment container to the left
      let delta = (ip + iw +  (mw / 2 - iw / 2)) - mw - sp;
      pos = sp + delta;
      let max = this.toolbar.segmentWidth - mw;
      pos = pos < max? pos : max;

    } else if (ip -  (mw / 2 - iw / 2) < sp) {

      // we need to move the segment container to the right
      pos = ip -  (mw / 2 - iw / 2);
      pos = pos >= 0 ? pos : 0;

    } else return; // no need to move the segment container

    this.toolbar.setSegmentPosition(pos, ease);

  }

  private getRelativeIndicatorPosition(index: number = this.selectedTabIndex): number {
    let position: number = 0;
    for (let i: number = 0; i < this.toolbar.segmentButtonWidths.length; i++) {
      if (index > Number(i)) {
        position += this.toolbar.segmentButtonWidths[i] + 5;
      }
    }
    position += 5 * (index + 1);
    return position;
  }

  private getAbsoluteIndicatorPosition(): number {
    let position: number = this.selectedTabIndex * this.tabsContainer.tabWidth / this.tabs.length;
    return position <= this.maxIndicatorPosition ? position : this.maxIndicatorPosition;
  }

  /**
   * Gets the width of a tab button when `scrollTabs` is set to `true`
   */
  private getSegmentButtonWidth(index: number = this.selectedTabIndex): number {
    if (!this.isToolbarVisible) return;
    return this.toolbar.segmentButtonWidths[index];
  }

  private setFixedIndicatorWidth() {
    if (this.scrollTabs || !this.isToolbarVisible) return;
    // the width of the "slide", should be equal to the width of a single `ion-segment-button`
    // we'll just calculate it instead of querying for a segment button
    this.toolbar.setIndicatorWidth(this.el.nativeElement.offsetWidth / this.tabs.length, false);
  }

  /**
   * Aligns slide position with selected tab
   */
  private alignIndicatorPosition(ease: boolean = false) {
    if (!this.isToolbarVisible) return;

    if (this.scrollTabs) {
      this.toolbar.alignIndicator(this.getRelativeIndicatorPosition(), this.getSegmentButtonWidth(), ease);
      this.alignTabButtonsContainer(ease);
    } else {
      this.toolbar.setIndicatorPosition(this.getAbsoluteIndicatorPosition(), ease);
    }
  }

  getTabIndexById(tabId: string): number {
    return this.tabs.findIndex((tab: SuperTab) => tab.tabId === tabId);
  }

  getTabById(tabId: string): SuperTab {
    return this.tabs.find((tab: SuperTab) => tab.tabId === tabId);
  }

  getElementRef() { return this.el; }

  initPane() { return true; }

  paneChanged() {}

  getSelected() {}

}

let superTabsIds = -1;
