import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  QueueApi,
  State,
} from '@stencil/core';
import { SuperTabsConfig } from '../interface';
import { checkGesture, debugLog, getNormalizedScrollX, getScrollX, pointerCoord, scrollEl, STCoord } from '../utils';


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
  @Prop() color: string | undefined = 'primary';

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

  /**
   * Emits an event when a button is clicked
   * Event data contains the clicked SuperTabButton component
   */
  @Event() buttonClick!: EventEmitter<HTMLSuperTabButtonElement>;

  @State() buttons: HTMLSuperTabButtonElement[] = [];

  private indicatorPosition: number | undefined;
  private indicatorWidth: number | undefined;
  private activeButton?: HTMLSuperTabButtonElement;
  private activeTabIndex: number = 0;
  private indicatorEl: HTMLSuperTabIndicatorElement | undefined;
  private buttonsContainerEl: HTMLDivElement | undefined;
  private shouldCapture?: boolean;
  private initialCoords?: STCoord;
  private lastPosX: number | undefined;
  private isDragging: boolean | undefined;
  private leftThreshold: number = 0;
  private rightThreshold: number = 0;
  private slot!: HTMLSlotElement;

  async componentDidLoad() {
    this.debug('componentDidLoad');

    await this.queryButtons();
    this.slot = this.el.shadowRoot!.querySelector('slot') as HTMLSlotElement;
    this.slot.addEventListener('slotchange', this.onSlotChange.bind(this));

    if (this.activeTabIndex > 0) {
      requestAnimationFrame(() => {
        this.alignIndicator(this.activeTabIndex);
      });
    }
  }

  componentWillUpdate() {
    this.debug('componentWillUpdate fired');
    this.updateThresholds();
  }

  /** @internal */
  @Method()
  setActiveTab(index: number, align?: boolean, animate?: boolean): Promise<void> {
    this.activeTabIndex = index;
    this.markButtonActive(this.buttons[index]);

    if (align) {
      this.alignIndicator(index, animate);
    }

    return Promise.resolve();
  }

  /** @internal */
  @Method()
  setSelectedTab(index: number, animate?: boolean): Promise<void> {
    this.alignIndicator(index, animate);
    return Promise.resolve();
  }

  /** @internal */
  @Method()
  moveContainer(scrollX: number, animate?: boolean): Promise<void> {
    if (!this.buttonsContainerEl) {
      this.debug('moveContainer called before this.buttonsContainerEl was defined');
      return Promise.resolve();
    }

    scrollEl(this.buttonsContainerEl, scrollX, 0, animate ? this.config!.transitionDuration : 0, this.queue);
    return Promise.resolve();
  }

  @Listen('click')
  onClick(ev: any) {
    if (!ev || !ev.target) {
      return;
    }

    let button: HTMLSuperTabButtonElement = ev.target;

    const tag = button.tagName.toLowerCase();

    if (tag !== 'super-tab-button') {
      if (tag === 'super-tabs-toolbar') {
        return;
      }

      button = button.closest('super-tab-button') as HTMLSuperTabButtonElement;
    }

    this.setActiveTab(button.index as number, true, true);
    this.buttonClick.emit(button);
  }

  @Listen('touchstart')
  async onTouchStart(ev: TouchEvent) {
    this.debug('onTouchStart called with: ', ev);

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
    if (!this.buttonsContainerEl) {
      this.debug('onTouchMove called before this.buttonsContainerEl was defined');
      return Promise.resolve();
    }

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
      const scrollLeft = getScrollX(this.buttonsContainerEl!);
      const scrollX = getNormalizedScrollX(this.buttonsContainerEl!, deltaX);

      if (scrollX === scrollLeft) {
        return;
      }
      this.moveContainer(scrollX, false);
    });
  }

  @Listen('touchend')
  async onTouchEnd() {
    this.debug('onTouchEnd called');

    this.isDragging = false;
    this.shouldCapture = void 0;
    this.lastPosX = void 0;
  }

  private async onSlotChange() {
    this.debug('onSlotChange fired');
    await this.queryButtons();
    await this.alignIndicator(this.activeTabIndex);
  }

  private async queryButtons() {
    const buttons = Array.from(this.el.querySelectorAll('super-tab-button'));
    await Promise.all(buttons.map(b => b.componentOnReady()));

    if (!buttons) {
      return;
    }

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      button.index = i;
      button.scrollableContainer = this.scrollable;

      if (this.activeTabIndex === i) {
        this.markButtonActive(button);
      }
    }

    this.buttons = buttons;
  }

  private updateThresholds() {
    if (!this.config) {
      return;
    }

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'left') {
      this.leftThreshold = this.config!.sideMenuThreshold!;
    }

    if (this.config!.sideMenu === 'both' || this.config!.sideMenu === 'right') {
      this.rightThreshold = this.config!.sideMenuThreshold!;
    }
  }

  private markButtonActive(button: HTMLSuperTabButtonElement) {
    if (!button) {
      return;
    }

    if (this.activeButton) {
      this.activeButton.active = false;
    }

    button.active = true;
    this.activeButton = button;
  }

  private adjustContainerScroll(animate: boolean) {
    if (!this.buttonsContainerEl) {
      this.debug('adjustContainerScroll called before this.buttonsContainerEl was defined');
      return;
    }

    this.queue.read(() => {
      let pos: number;

      const ip = this.indicatorPosition!;
      const iw = this.indicatorWidth!;
      const mw = this.buttonsContainerEl!.clientWidth;
      const sp = getScrollX(this.buttonsContainerEl!);

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

  /**
   * Align the indicator with the selected button.
   * This will adjust the width and the position of the indicator element.
   * @param index {number} the active tab index
   * @param [animate] {boolean=false} whether to animate the transition
   */
  private alignIndicator(index: number, animate: boolean = false) {
    this.debug('alignIndicator', index, animate);

    if (!this.indicatorEl) {
      this.debug('alignIndicator called before this.buttonsContainerEl was defined');
      return;
    }

    if (!this.showIndicator) {
      return;
    }

    this.queue.read(() => {
      const remainder = index % 1;
      const isDragging = this.isDragging = remainder > 0;

      let position: number, width: number;

      const floor = Math.floor(index), ceil = Math.ceil(index);
      const button = this.buttons[floor];

      if (!button) {
        return;
      }

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

      if (this.scrollable) {
        this.adjustContainerScroll(animate || !isDragging);
      }

      this.debug('alignIndicator.pre-raf', this.indicatorPosition, this.indicatorWidth);
      requestAnimationFrame(() => {
        if (!this.showIndicator || this.indicatorEl) {
          this.indicatorEl!.style.setProperty('--st-indicator-position-x', this.indicatorPosition + 'px');
          this.indicatorEl!.style.setProperty('--st-indicator-scale-x', String(this.indicatorWidth! / 100));
          this.indicatorEl!.style.setProperty('--st-indicator-transition-duration', this.isDragging ? '0' : `${this.config!.transitionDuration}ms`);
        }
      });
    });
  }

  /**
   * Internal method to output values in debug mode.
   */
  private debug(...vals: any[]) {
    debugLog(this.config!, 'toolbar', vals);
  }

  render() {
    this.debug('Rendering');

    const cls: any = {};

    if (typeof this.color === 'string' && this.color.trim().length > 0) {
      cls['ion-color-' + this.color.trim()] = true;
    }

    return (
      <Host role="navigation" class={cls}>
        <div class="buttons-container" ref={(ref: any) => this.buttonsContainerEl = ref}>
          <slot/>
          {this.showIndicator &&
          <super-tab-indicator ref={(ref: any) => this.indicatorEl = ref}
                               toolbarPosition={this.el!.assignedSlot!.name as any}/>}
        </div>
      </Host>
    );
  }
}
