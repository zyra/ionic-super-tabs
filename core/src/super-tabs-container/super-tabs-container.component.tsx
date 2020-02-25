import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  QueueApi,
  State,
} from '@stencil/core';
import { SuperTabsConfig } from '../interface';
import {
  checkGesture,
  debugLog,
  getNormalizedScrollX,
  getScrollX,
  getTs,
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

  /** @internal */
  @Prop({ mutable: true }) config?: SuperTabsConfig;

  /** @internal */
  @Prop({ context: 'queue' }) queue!: QueueApi;

  /**
   * Enable/disable swiping
   */
  @Prop() swipeEnabled: boolean = true;

  /**
   * Set to true to automatically scroll to the top of the tab when the button is clicked while the tab is
   * already selected.
   */
  @Prop() autoScrollTop: boolean = false;

  /**
   * Emits an event when the active tab changes.
   * An active tab is the tab that the user looking at.
   *
   * This event emitter will not notify you if the user has changed the current active tab.
   * If you need that information, you should use the `tabChange` event emitted by the `super-tabs` element.
   */
  @Event() activeTabIndexChange!: EventEmitter<number>;

  /**
   * Emits events when the container moves.
   * Selected tab index represents what the user should be seeing.
   * If you receive a decimal as the emitted number, it means that the container is moving between tabs.
   * This number is used for animations, and can be used for high tab customizations.
   */
  @Event() selectedTabIndexChange!: EventEmitter<number>;

  @State() tabs: HTMLSuperTabElement[] = [];

  private initialCoords: STCoord | undefined;
  private lastPosX: number | undefined;
  private isDragging: boolean = false;
  private initialTimestamp?: number;
  private _activeTabIndex: number | undefined;
  private _selectedTabIndex?: number;
  private leftThreshold: number = 0;
  private rightThreshold: number = 0;
  private scrollWidth: number = 0;
  private clientWidth: number = 0;
  private slot!: HTMLSlotElement;
  private ready?: boolean;

  componentDidLoad() {
    this.debug('componentDidLoad');
    this.slot = this.el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    this.slot.addEventListener('slotchange', this.onSlotChange.bind(this));
  }

  private async onSlotChange() {
    const tabs = Array.from(this.el.querySelectorAll('super-tab'));
    await Promise.all(tabs.map(t => t.componentOnReady()));
    this.tabs = tabs;
    this.debug('onSlotChange', this.tabs.length);

    if (this.ready && typeof this._activeTabIndex === 'number') {
      this.moveContainerByIndex(this._activeTabIndex, true);
    }
  }

  componentWillUpdate() {
    this.indexTabs();
  }

  /**
   * @internal
   */
  @Method()
  async reindexTabs() {
    this.indexTabs();
  }

  /**
   * @internal
   *
   * Moves the container to align with the specified tab index
   * @param index {number} Index of the tab
   * @param animate {boolean} Whether to animate the transition
   */
  @Method()
  moveContainerByIndex(index: number, animate?: boolean): Promise<void> {
    const scrollX = this.indexToPosition(index);

    if (scrollX === 0 && index > 0) {
      return Promise.resolve();
    }

    return this.moveContainer(scrollX, animate);
  }

  /**
   * @internal
   *
   * Sets the scrollLeft property of the container
   * @param scrollX {number}
   * @param animate {boolean}
   */
  @Method()
  moveContainer(scrollX: number, animate?: boolean): Promise<void> {
    scrollEl(this.el, scrollX, 0, animate ? this.config!.transitionDuration : 0);
    return Promise.resolve();
  }

  /** @internal */
  @Method()
  async setActiveTabIndex(index: number, moveContainer: boolean = true, animate: boolean = true): Promise<void> {
    this.debug('setActiveTabIndex', index);

    if (this._activeTabIndex === index) {
      if (!this.autoScrollTop) {
        return;
      }

      await this.scrollToTop();
    }

    if (moveContainer) {
      await this.moveContainerByIndex(index, animate);
    }

    await this.updateActiveTabIndex(index, false);
  }

  /**
   * Scroll the active tab to the top.
   */
  @Method()
  async scrollToTop() {
    if (this._activeTabIndex === undefined || this.tabs === undefined) {
      this.debug('activeTabIndex or tabs was undefined');
      return;
    }

    const current = this.tabs[this._activeTabIndex];
    this.queue.read(() => {
      if (!current) {
        this.debug('Current active tab was undefined in scrollToTop');
        return;
      }

      current.getRootScrollableEl()
        .then(el => {
          if (el) {
            scrollEl(el, 0, 0, this.config!.transitionDuration);
          }
        });
    });
  }

  private updateActiveTabIndex(index: number, emit: boolean = true) {
    this.debug('updateActiveTabIndex', index, emit, this._activeTabIndex);

    this._activeTabIndex = index;
    emit && this.activeTabIndexChange.emit(this._activeTabIndex);
  }

  private updateSelectedTabIndex(index: number) {
    if (index === this._selectedTabIndex) {
      return;
    }

    this._selectedTabIndex = index;
    this.selectedTabIndexChange.emit(this._selectedTabIndex);
  }

  @Listen('touchstart')
  async onTouchStart(ev: TouchEvent) {
    if (!this.swipeEnabled) {
      return;
    }

    if (this.config!.avoidElements) {
      let avoid: boolean = false;
      let element: any = ev.target;

      if (element) {
        do {
          if (typeof element.getAttribute === 'function' && element.getAttribute('avoid-super-tabs')) {
            return;
          }

          element = element.parentElement;
        } while (element && !avoid);
      }
    }

    const coords = pointerCoord(ev);
    const vw = this.clientWidth;
    if (coords.x < this.leftThreshold || coords.x > vw - this.rightThreshold) {
      // ignore this gesture, it started in the side menu touch zone
      return;
    }

    if (this.config!.shortSwipeDuration! > 0) {
      this.initialTimestamp = getTs();
    }

    this.initialCoords = coords;
    this.lastPosX = coords.x;
  }

  @Listen('click', { passive: false, capture: true })
  async onClick(ev: TouchEvent) {
    if (this.isDragging) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
  }

  @Listen('touchmove', { passive: true, capture: true })
  async onTouchMove(ev: TouchEvent) {
    if (!this.swipeEnabled || !this.initialCoords || typeof this.lastPosX !== 'number') {
      return;
    }

    const coords = pointerCoord(ev);

    if (!this.isDragging) {
      const shouldCapture = checkGesture(coords, this.initialCoords, this.config!);

      if (!shouldCapture) {
        if (Math.abs(coords.y - this.initialCoords.y) > 100) {
          this.initialCoords = void 0;
          this.lastPosX = void 0;
        }
        return;
      }

      // gesture is good, let's capture all next onTouchMove events
      this.isDragging = true;
    }

    // scroll container

    if (!this.isDragging) {
      return;
    }

    // stop anything else from capturing these events, to make sure the content doesn't slide
    if (!this.config!.allowElementScroll) {
      ev.stopImmediatePropagation();
    }

    // get delta X
    const deltaX: number = this.lastPosX! - coords.x;

    if (deltaX === 0) {
      return;
    }

    const scrollLeft = getScrollX(this.el);
    const scrollX = getNormalizedScrollX(this.el, deltaX);

    if (scrollX === scrollLeft) {
      return;
    }

    this.updateSelectedTabIndex(
      this.positionToIndex(
        scrollX,
      ),
    );

    // update last X value
    this.lastPosX = coords.x;
    this.moveContainer(scrollX, false);
  }

  @Listen('touchend', { passive: false, capture: true })
  async onTouchEnd(ev: TouchEvent) {
    if (!this.swipeEnabled || !this.isDragging) {
      return;
    }

    const coords = pointerCoord(ev);

    const deltaTime: number = getTs() - this.initialTimestamp!;
    const shortSwipe = this.config!.shortSwipeDuration! > 0 && deltaTime <= this.config!.shortSwipeDuration!;
    const shortSwipeDelta = coords.x - this.initialCoords!.x;

    let selectedTabIndex = this.calcSelectedTab();
    const expectedTabIndex = Math.round(selectedTabIndex);

    if (shortSwipe && expectedTabIndex === this._activeTabIndex) {
      selectedTabIndex += shortSwipeDelta > 0 ? -1 : 1;
    }

    selectedTabIndex = this.normalizeSelectedTab(selectedTabIndex);
    this.updateActiveTabIndex(selectedTabIndex);
    this.moveContainerByIndex(selectedTabIndex, true);

    this.isDragging = false;
    this.initialCoords = void 0;
    this.lastPosX = void 0;
  }

  private indexTabs(): any {
    this.scrollWidth = this.el.scrollWidth;
    this.clientWidth = this.el.clientWidth;

    this.debug('indexTab', this.scrollWidth, this.clientWidth);

    if (this.scrollWidth === 0 || this.clientWidth === 0) {
      requestAnimationFrame(() => {
        this.indexTabs();
      });
      return;
    }

    if (this.config) {
      switch (this.config.sideMenu) {
        case 'both':
          this.rightThreshold = this.leftThreshold = this.config.sideMenuThreshold || 0;
          break;
        case 'left':
          this.leftThreshold = this.config.sideMenuThreshold || 0;
          break;
        case 'right':
          this.rightThreshold = this.config.sideMenuThreshold || 0;
          break;
      }
    }

    if (this._activeTabIndex !== undefined) {
      this.moveContainerByIndex(this._activeTabIndex, false)
        .then(() => {
          this.ready = true;
        });
    }
  }

  private calcSelectedTab(): number {
    const tabsWidth = this.scrollWidth;
    const tabWidth = this.clientWidth;
    const minX = 0;
    const maxX = tabsWidth - tabWidth;
    const scrollX = Math.max(minX, Math.min(maxX, getScrollX(this.el)));

    return this.positionToIndex(scrollX);
  }

  private positionToIndex(scrollX: number) {
    const tabWidth = this.clientWidth;
    return scrollX / tabWidth;
  }

  private indexToPosition(tabIndex: number) {
    this.debug('indexToPosition', tabIndex, this.clientWidth);
    const tabWidth = this.clientWidth;
    return tabIndex * tabWidth;
  }

  private normalizeSelectedTab(index: number): number {
    const tabsWidth = this.scrollWidth;
    const tabWidth = this.clientWidth;
    const minX = 0;
    const maxX = tabsWidth - tabWidth;
    const scrollX = Math.max(minX, Math.min(maxX, tabWidth * Math.round(index)));

    return scrollX / tabWidth;
  }

  /**
   * Internal method to output values in debug mode.
   */
  private debug(...vals: any[]) {
    debugLog(this.config!, 'container', vals);
  }

  render() {
    return <slot></slot>;
  }
}
