import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { SuperTabsConfig } from '../interface';
import {
  checkGesture,
  getNormalizedScrollX,
  pointerCoord,
  scrollEl,
  STCoord,
} from '../utils';

@Component({
  tag: 'super-tabs-container',
  styleUrl: 'super-tabs-container.component.scss',
  shadow: true,
})
export class SuperTabsContainerComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsContainerElement;

  @Prop({ mutable: true }) config?: SuperTabsConfig;
  @Prop({ mutable: true }) swipeEnabled: boolean = true;

  @Event() activeTabIndexChange!: EventEmitter<number>;
  @Event() selectedTabIndexChange!: EventEmitter<number>;

  private tabs: HTMLSuperTabElement[] = [];
  private shouldCapture?: boolean;
  private initialCoords?: STCoord;
  private lastPosX?: number;
  private isDragging?: boolean;
  private initialTimestamp?: number;
  private _activeTabIndex?: number;
  private _selectedTabIndex?: number;
  private leftThreshold: number = 0;
  private rightThreshold: number = 0;

  componentWillLoad() {
    this.indexTabs();
  }

  componentDidUpdate() {
    this.indexTabs();
  }

  /**
   * Moves the container to align with the specified tab index
   * @param index {number} Index of the tab
   * @param animate {boolean} Whether to animate the transition
   */
  @Method()
  moveContainerByIndex(index: number, animate?: boolean) {
    const scrollX = this.indexToPosition(index);
    return this.moveContainer(scrollX, animate);
  }

  /**
   * Sets the scrollLeft property of the container
   * @param scrollX {number}
   * @param animate {boolean}
   */
  @Method()
  async moveContainer(scrollX: number, animate?: boolean) {
    await scrollEl(this.el, scrollX, animate? this.config!.transitionDuration : 0);
  }

  setActiveTabIndex(index: number) {
    this._activeTabIndex = index;
    this.activeTabIndexChange.emit(this._activeTabIndex);
  }

  setSelectedTabIndex(index: number) {
    if (index === this._selectedTabIndex) {
      return;
    }

    this._selectedTabIndex = index;
    this.selectedTabIndexChange.emit(this._selectedTabIndex);
  }

  @Listen('touchstart')
  async onTouchStart(ev: TouchEvent) {
    let avoid: boolean = false;
    let element: any = ev.target;

    if (element) {
      do {
        if (typeof element.getAttribute === 'function' && element.getAttribute('avoid-super-tabs')) {
          this.shouldCapture = false;
          return;
        }

        element = element.parentElement;
      } while (element && !avoid);
    }

    const coords = pointerCoord(ev);
    const vw = this.el.clientWidth;
    if (coords.x < this.leftThreshold || coords.x > vw - this.rightThreshold) {
      // ignore this gesture, it started in the side menu touch zone
      this.shouldCapture = false;
      return;
    }

    this.initialCoords = coords;

    if (this.config!.shortSwipeDuration! > 0) {
      this.initialTimestamp = window.performance.now();
    }

    this.lastPosX = coords.x;
  }

  @Listen('touchmove', { passive: false })
  async onTouchMove(ev: TouchEvent) {
    const coords = pointerCoord(ev);

    if (!this.isDragging) {
      if (typeof this.shouldCapture !== 'boolean') {
        // we haven't decided yet if we want to capture this gesture
        this.shouldCapture = checkGesture(coords, this.initialCoords!, this.config!);
      }

      if (this.shouldCapture !== true) {
        return;
      }

      // gesture is good, let's capture all next onTouchMove events
      this.isDragging = true;
    }

    // stop anything else from capturing these events, to make sure the content doesn't slide
    if (this.config!.allowElementScroll !== true) {
      ev.stopPropagation();
      ev.preventDefault();
    }

    // get delta X
    // @ts-ignore
    const deltaX: number = this.lastPosX - coords.x;

    if (deltaX === 0) {
      return;
    }

    // scroll container
    requestAnimationFrame(async () => {
      const scrollLeft = this.el.scrollLeft;
      const scrollX = getNormalizedScrollX(this.el, deltaX);

      if (scrollX === scrollLeft) {
        return;
      }

      try {
        await this.moveContainer(scrollX, false);
      } catch (err) {
        console.error('[st-container] onTouchMove: ', err);
      }
    });

    this.setSelectedTabIndex(
      this.positionToIndex(
        getNormalizedScrollX(this.el, deltaX),
      ),
    );

    // update last X value
    this.lastPosX = coords.x;
  }

  @Listen('touchend')
  async onTouchEnd(ev: TouchEvent) {
    const coords = pointerCoord(ev);

    if (this.shouldCapture === true) {
      const deltaTime: number = window.performance.now() - this.initialTimestamp!;
      const shortSwipe = this.config!.shortSwipeDuration! > 0 && deltaTime <= this.config!.shortSwipeDuration!;
      const shortSwipeDelta = coords.x - this.initialCoords!.x;

      requestAnimationFrame(() => {
        let selectedTabIndex = this.calcSelectedTab();
        const expectedTabIndex = Math.round(selectedTabIndex);

        if (shortSwipe && expectedTabIndex === this._activeTabIndex) {
          selectedTabIndex += shortSwipeDelta > 0 ? -1 : 1;
        }

        selectedTabIndex = this.normalizeSelectedTab(selectedTabIndex);
        this.setActiveTabIndex(selectedTabIndex);

        this.moveContainer(this.indexToPosition(selectedTabIndex), true);
      });
    }

    this.isDragging = false;
    this.shouldCapture = void 0;
  }

  private indexTabs() {
    const tabs = this.el.querySelectorAll('super-tab');
    const tabsArray = [];

    for (let i = 0; i < tabs.length; i++) {
      tabsArray.push(tabs[i]);
    }

    this.tabs = tabsArray;
    this.stTabsChange.emit(this.tabs);

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'left') {
      this.leftThreshold = this.config!.sideMenuThreshold!;
    }

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'right') {
      this.rightThreshold = this.config!.sideMenuThreshold!;
    }
  }

  private calcSelectedTab(): number {
    const tabsWidth = this.el.scrollWidth;
    const tabWidth = this.el.clientWidth;
    const minX = 0;
    const maxX = tabsWidth - tabWidth;
    const scrollX = Math.max(minX, Math.min(maxX, this.el.scrollLeft));

    return this.positionToIndex(scrollX);
  }

  private positionToIndex(scrollX: number) {
    const tabWidth = this.el.clientWidth;
    return scrollX / tabWidth;
  }

  private indexToPosition(scrollX: number) {
    const tabWidth = this.el.clientWidth;
    return scrollX * tabWidth;
  }

  private normalizeSelectedTab(index: number): number {
    const tabsWidth = this.el.scrollWidth;
    const tabWidth = this.el.clientWidth;
    const minX = 0;
    const maxX = tabsWidth - tabWidth;
    const scrollX = Math.max(minX, Math.min(maxX, tabWidth * Math.round(index)));

    return scrollX / tabWidth;
  }

  hostData() {
    return {};
  }

  render() {
    return <slot></slot>;
  }
}
