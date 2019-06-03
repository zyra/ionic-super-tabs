import { Component, ComponentInterface, Element, Event, EventEmitter, h, Listen, Method, Prop, QueueApi } from '@stencil/core';
import { SuperTabsConfig } from '../interface';
import { checkGesture, getNormalizedScrollX, pointerCoord, scrollEl, STCoord } from '../utils';

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

  private tabs: HTMLSuperTabElement[] = [];
  private shouldCapture?: boolean;
  private initialCoords?: STCoord;
  private lastPosX?: number;
  private isDragging?: boolean;
  private initialTimestamp?: number;
  private _activeTabIndex: number = 0;
  private _selectedTabIndex?: number;
  private leftThreshold: number = 0;
  private rightThreshold: number = 0;
  private scrollWidth: number = 0;
  private clientWidth: number = 0;

  componentDidLoad() {
    this.indexTabs();
  }

  componentDidUpdate() {
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
    scrollEl(this.el, scrollX, 0, animate ? this.config!.transitionDuration : 0, this.queue);

    return Promise.resolve();
  }

  /** @internal */
  @Method()
  async setActiveTabIndex(index: number): Promise<void> {
    if (this._activeTabIndex === index) {
      if (!this.autoScrollTop) {
        return;
      }

      const current = this.tabs[this._activeTabIndex];
      this.queue.read(() => {
        current.getRootScrollableEl()
          .then(el => {
            if (el) {
              this.queue.write(() => {
                scrollEl(el, 0, 0, this.config!.transitionDuration, this.queue);
              });
            }
          });
      });
    }

    this.moveContainerByIndex(index, true);
    this.updateActiveTabIndex(index, false);
  }

  private updateActiveTabIndex(index: number, emit: boolean = true) {
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

  @Listen('resize', { target: 'window' })
  async onWindowResize() {
    this.indexTabs();
  }

  @Listen('touchstart')
  async onTouchStart(ev: TouchEvent) {
    if (!this.swipeEnabled) {
      return;
    }

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
    const vw = this.clientWidth;
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
    if (!this.swipeEnabled) {
      return;
    }

    // scroll container
    this.queue.read(() => {
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
      if (!this.config!.allowElementScroll) {
        ev.stopPropagation();
        ev.preventDefault();
      }

      // get delta X
      const deltaX: number = this.lastPosX! - coords.x;

      if (deltaX === 0) {
        return;
      }

      const scrollLeft = this.el.scrollLeft;
      const scrollX = getNormalizedScrollX(this.el, deltaX);

      if (scrollX === scrollLeft) {
        return;
      }

      this.updateSelectedTabIndex(
        this.positionToIndex(
          scrollX,
        ),
      );

      this.queue.write(() => {
        // update last X value
        this.lastPosX = coords.x;
        this.moveContainer(scrollX, false);
      });
    });
  }

  @Listen('touchend')
  async onTouchEnd(ev: TouchEvent) {
    if (!this.swipeEnabled) {
      return;
    }

    const coords = pointerCoord(ev);

    if (this.shouldCapture === true) {
      const deltaTime: number = window.performance.now() - this.initialTimestamp!;
      const shortSwipe = this.config!.shortSwipeDuration! > 0 && deltaTime <= this.config!.shortSwipeDuration!;
      const shortSwipeDelta = coords.x - this.initialCoords!.x;

      this.queue.read(() => {
        let selectedTabIndex = this.calcSelectedTab();
        const expectedTabIndex = Math.round(selectedTabIndex);

        if (shortSwipe && expectedTabIndex === this._activeTabIndex) {
          selectedTabIndex += shortSwipeDelta > 0 ? -1 : 1;
        }

        selectedTabIndex = this.normalizeSelectedTab(selectedTabIndex);
        this.updateActiveTabIndex(selectedTabIndex);

        this.queue.write(() => {
          this.moveContainer(this.indexToPosition(selectedTabIndex), true);
        });
      });
    }

    this.isDragging = false;
    this.shouldCapture = void 0;
  }

  private indexTabs() {
    this.queue.read(() => {
      this.scrollWidth = this.el.scrollWidth;
      this.clientWidth = this.el.clientWidth;

      const tabs = this.el.querySelectorAll('super-tab');
      const tabsArray: HTMLSuperTabElement[] = [];

      for (let i = 0; i < tabs.length; i++) {
        tabsArray.push(tabs[i]);
      }

      this.tabs = tabsArray;
    });

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'left') {
      this.leftThreshold = this.config!.sideMenuThreshold!;
    }

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'right') {
      this.rightThreshold = this.config!.sideMenuThreshold!;
    }
  }

  private calcSelectedTab(): number {
    const tabsWidth = this.scrollWidth;
    const tabWidth = this.clientWidth;
    const minX = 0;
    const maxX = tabsWidth - tabWidth;
    const scrollX = Math.max(minX, Math.min(maxX, this.el.scrollLeft));

    return this.positionToIndex(scrollX);
  }

  private positionToIndex(scrollX: number) {
    const tabWidth = this.clientWidth;
    return scrollX / tabWidth;
  }

  private indexToPosition(scrollX: number) {
    const tabWidth = this.clientWidth;
    return scrollX * tabWidth;
  }

  private normalizeSelectedTab(index: number): number {
    const tabsWidth = this.scrollWidth;
    const tabWidth = this.clientWidth;
    const minX = 0;
    const maxX = tabsWidth - tabWidth;
    const scrollX = Math.max(minX, Math.min(maxX, tabWidth * Math.round(index)));

    return scrollX / tabWidth;
  }

  render() {
    return <slot></slot>;
  }
}
