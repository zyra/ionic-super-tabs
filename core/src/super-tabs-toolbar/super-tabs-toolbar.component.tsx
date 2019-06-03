import { Component, ComponentInterface, Element, Event, EventEmitter, h, Listen, Method, Prop, QueueApi } from '@stencil/core';
import { SuperTabsConfig } from '../interface';
import { checkGesture, getNormalizedScrollX, pointerCoord, scrollEl, STCoord } from '../utils';

@Component({
  tag: 'super-tabs-toolbar',
  styleUrl: 'super-tabs-toolbar.component.scss',
  shadow: true,
})
export class SuperTabsToolbarComponent implements ComponentInterface {

  @Element() el!: HTMLSuperTabsToolbarElement;

  /** @internal */
  @Prop({ mutable: true }) config?: SuperTabsConfig;

  /**
   * Whether to show the indicator. Defaults to `true`
   */
  @Prop() showIndicator: boolean = true;

  /**
   * Background color. Defaults to `'primary'`
   */
  @Prop() color: string = 'primary';

  /**
   * Whether the toolbar is scrollable. Defaults to `false`.
   */
  @Prop({ reflectToAttr: true }) scrollable: boolean = false;

  /**
   * If scrollable is set to true, there will be an added padding
   * to the left of the buttons.
   *
   * Setting this property to false will remove that padding.
   *
   * The padding is also configurable via a CSS variable.
   */
  @Prop({ reflectToAttr: true }) scrollablePadding: boolean = true;

  /** @internal */
  @Prop({ context: 'queue' }) queue!: QueueApi;

  @Event() buttonClick!: EventEmitter<HTMLSuperTabButtonElement>;

  private buttons!: HTMLSuperTabButtonElement[];
  private indicatorPosition!: number;
  private indicatorWidth!: number;
  private activeButton?: HTMLSuperTabButtonElement;
  private activeTabIndex: number = 0;
  private indicatorEl!: HTMLSuperTabIndicatorElement;
  private buttonsContainerEl!: HTMLDivElement;
  private shouldCapture?: boolean;
  private initialCoords?: STCoord;
  private lastPosX?: number;
  private isDragging?: boolean;
  private leftThreshold: number = 0;
  private rightThreshold: number = 0;

  componentDidLoad() {
    this.indexButtons();
  }

  componentDidUpdate() {
    this.indexButtons();
  }

  /** @internal */
  @Method()
  setActiveTab(index: number): Promise<void> {
    this.activeTabIndex = index;
    this.alignIndicator(index, true);
    this.markButtonActive(this.buttons[index]);

    return Promise.resolve();
  }

  /** @internal */
  @Method()
  setSelectedTab(index: number): Promise<void> {
    this.alignIndicator(index);

    return Promise.resolve();
  }

  /** @internal */
  @Method()
  moveContainer(scrollX: number, animate?: boolean): Promise<void> {
    scrollEl(this.buttonsContainerEl, scrollX, 0, animate ? this.config!.transitionDuration : 0, this.queue);

    return Promise.resolve();
  }

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.alignIndicator(this.activeTabIndex);
  }

  @Listen('click')
  onClick(ev: any) {
    let button: HTMLSuperTabButtonElement = ev.target;

    const tag = button.tagName.toLowerCase();

    if (tag !== 'super-tab-button') {
      if (tag === 'super-tabs-toolbar') {
        return;
      }

      button = button.closest('super-tab-button') as HTMLSuperTabButtonElement;
    }

    this.setActiveTab(button.index as number);
    this.buttonClick.emit(button);
  }

  @Listen('touchstart')
  async onTouchStart(ev: TouchEvent) {
    this.queue.read(() => {
      const coords = pointerCoord(ev);
      const vw = this.el.clientWidth;

      if (coords.x < this.leftThreshold || coords.x > vw - this.rightThreshold) {
        // ignore this gesture, it started in the side menu touch zone
        this.shouldCapture = false;
        return;
      }

      this.initialCoords = coords;
      this.lastPosX = coords.x;
    });
  }

  @Listen('touchmove')
  async onTouchMove(ev: TouchEvent) {
    this.queue.read(() => {
      const coords = pointerCoord(ev);

      if (typeof this.lastPosX !== 'number') {
        return;
      }

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

      // get delta X
      const deltaX: number = this.lastPosX - coords.x;

      // update last X value
      this.lastPosX = coords.x;

      if (deltaX === 0) {
        return;
      }

      // scroll container
      const scrollLeft = this.buttonsContainerEl.scrollLeft;
      const scrollX = getNormalizedScrollX(this.buttonsContainerEl, deltaX);

      if (scrollX === scrollLeft) {
        return;
      }
      this.moveContainer(scrollX, false);
    });
  }

  @Listen('touchend')
  async onTouchEnd() {
    this.isDragging = false;
    this.shouldCapture = void 0;
    this.lastPosX = void 0;
  }

  private indexButtons() {
    const buttons = this.el.querySelectorAll('super-tab-button');
    const buttonsArray: HTMLSuperTabButtonElement[] = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      button.index = i;
      button.scrollableContainer = this.scrollable;

      if (this.activeTabIndex === i) {
        this.markButtonActive(button);
      }

      buttonsArray.push(button);
    }

    this.buttons = buttonsArray;
    this.alignIndicator(this.activeTabIndex);

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'left') {
      this.leftThreshold = this.config!.sideMenuThreshold!;
    }

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'right') {
      this.rightThreshold = this.config!.sideMenuThreshold!;
    }
  }

  private markButtonActive(button: HTMLSuperTabButtonElement) {
    if (this.activeButton) {
      this.activeButton.active = false;
    }

    button.active = true;
    this.activeButton = button;
  }

  private adjustContainerScroll(animate: boolean) {
    this.queue.read(() => {
      let pos: number;

      const ip = this.indicatorPosition;
      const iw = this.indicatorWidth;
      const mw = this.buttonsContainerEl.clientWidth;
      const sp = this.buttonsContainerEl.scrollLeft;

      const centerDelta = (mw / 2 - iw / 2);

      if (ip + iw + centerDelta > mw + sp) {
        // we need to move the segment container to the left
        const delta: number = ip + iw + centerDelta - mw - sp;
        pos = sp + delta;
      } else if (ip - centerDelta < sp) {
        // we need to move the segment container to the right
        pos = ip - centerDelta;
        pos = Math.max(pos, 0);
        pos = pos > ip ? ip - mw + iw : pos;
      }

      if (typeof pos! === 'number') {
        this.moveContainer(pos!, animate);
      }
    });
  }

  private alignIndicator(index: number, animate: boolean = false) {
    if (!this.showIndicator) {
      return;
    }

    this.queue.read(() => {
      const remainder = index % 1;
      const isDragging = this.isDragging = remainder > 0;

      let position: number, width: number;

      const floor = Math.floor(index), ceil = Math.ceil(index);
      const button = this.buttons[floor];

      position = button.offsetLeft;
      width = button.clientWidth;

      if (this.isDragging && floor !== ceil) {
        const buttonB = this.buttons[ceil];
        const buttonBWidth = buttonB.clientWidth;
        const buttonBPosition = buttonB.offsetLeft;

        position += remainder * (buttonBPosition - position);
        width += remainder * (buttonBWidth - width);
      }

      this.indicatorPosition = position;
      this.indicatorWidth = width;

      this.adjustContainerScroll(animate || !isDragging);

      this.queue.write(() => {
        if (!this.showIndicator || this.indicatorEl) {
          this.indicatorEl.style.setProperty('--st-indicator-position-x', this.indicatorPosition + 'px');
          this.indicatorEl.style.setProperty('--st-indicator-scale-x', String(this.indicatorWidth / 100));
          this.indicatorEl.style.setProperty('--st-indicator-transition-duration', this.isDragging ? '0' : `${this.config!.transitionDuration}ms`);
        }
      });
    });
  }

  hostData() {
    return {
      class: {
        ['ion-color-' + this.color]: true,
      },
    };
  }

  render() {
    return [
      <div class="buttons-container" ref={(ref: any) => this.buttonsContainerEl = ref}>
        <slot/>
        {this.showIndicator &&
        <super-tab-indicator ref={(ref: any) => this.indicatorEl = ref} toolbarPosition={this.el!.assignedSlot!.name as any}/>}
      </div>,
    ];
  }
}
