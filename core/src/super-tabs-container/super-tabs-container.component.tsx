import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import { pointerCoord, scrollEl, STCoord, SuperTabsConfig } from '../super-tabs.model';

@Component({
  tag: 'super-tabs-container',
  styleUrl: 'super-tabs-container.component.scss',
  shadow: true,
})
export class SuperTabsContainerComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsContainerElement;

  @Prop({ mutable: true }) config?: SuperTabsConfig;
  @Prop({ mutable: true }) swipeEnabled: boolean = true;

  @Event() stTabsChange!: EventEmitter<HTMLSuperTabElement[]>;
  @Event() activeTabChange!: EventEmitter<HTMLSuperTabElement[]>;

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

  @Method()
  moveContainerByIndex(index: number, animate?: boolean) {
    const scrollX = this.indexToPosition(index);
    return this.moveContainer(scrollX, animate);
  }

  @Method()
  async moveContainer(scrollX: number, animate?: boolean) {
    if (animate) {
      await scrollEl(this.el, scrollX, 0, this.config!.transitionDuration);
    } else {
      await scrollEl(this.el, scrollX, 0, 0);
    }
  }

  setActiveTabIndex(index: number) {
    this._activeTabIndex = index;
    this.activeTabIndexChange.emit(this._activeTabIndex);
  }

  setSelectedTabIndex(index: number) {
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
    // TODO: handle threshold, sidemenu ... etc

    this.initialCoords = coords;

    // TODO: handle short swipe duration
    // @ts-ignore
    if (this.config.shortSwipeDuration > 0) {
      this.initialTimestamp = window.performance.now();
    }
    this.lastPosX = coords.x;
  }

  private indexTabs() {
    const tabs = this.el.querySelectorAll('super-tab');
    const tabsArray = [];

    for (let i = 0; i < tabs.length; i++) {
      tabsArray.push(tabs[i]);
    }

    this.tabs = tabsArray;
    this.stTabsChange.emit(this.tabs);
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

  componentWillLoad() {
    this.indexTabs();
  }

  componentDidUpdate() {
    this.indexTabs();
  }

  private getScrollX(delta?: number) {
    return this.el.scrollLeft + (typeof delta === 'number' ? delta : 0);
  }

  private getNormalizedScrollX(delta?: number) {
    const minX = 0;
    const maxX = this.el.scrollWidth - this.el.clientWidth;
    let scrollX = this.getScrollX(delta);

    scrollX = Math.max(minX, Math.min(maxX, scrollX));

    return scrollX;
  }

  @Listen('touchmove', { passive: false })
  async onTouchMove(ev: TouchEvent) {
    const coords = pointerCoord(ev);

    if (!this.isDragging) {
      if (typeof this.shouldCapture !== 'boolean') {
        // we haven't decided yet if we want to capture this gesture
        this.checkGesture(coords);
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
      const scrollX = this.getNormalizedScrollX(deltaX);

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
        this.getNormalizedScrollX(deltaX),
      ),
    );

    // update last X value
    this.lastPosX = coords.x;
  }

  @Listen('touchend')
  async onTouchEnd(ev: TouchEvent) {
    console.log('Touch end!', this.shouldCapture);
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

  hostData() {
    return {};
  }

  private checkGesture(newCoords: STCoord) {
    if (!this.initialCoords) {
      return;
    }

    // @ts-ignore
    const radians = this.config.maxDragAngle * (Math.PI / 180),
      maxCosine = Math.cos(radians),
      deltaX = newCoords.x - this.initialCoords.x,
      deltaY = newCoords.y - this.initialCoords.y,
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // @ts-ignore
    if (distance >= this.config.dragThreshold) {
      // swipe is long enough
      // lets check the angle
      const angle = Math.atan2(deltaY, deltaX),
        cosine = Math.cos(angle);

      this.shouldCapture = Math.abs(cosine) > maxCosine;
    }
  }

  render() {
    return <slot></slot>;
  }
}
