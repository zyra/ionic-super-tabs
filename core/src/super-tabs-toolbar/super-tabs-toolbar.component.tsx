import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  checkGesture,
  getNormalizedScrollX,
  pointerCoord,
  scrollEl,
  STCoord,
  SuperTabsConfig,
} from '../super-tabs.model';

@Component({
  tag: 'super-tabs-toolbar',
  styleUrl: 'super-tabs-toolbar.component.scss',
  shadow: true,
})
export class SuperTabsToolbarComponent implements ComponentInterface {

  @Element() el!: HTMLSuperTabsToolbarElement;

  @Prop({ mutable: true }) toolbarPosition: 'top' | 'bottom' = 'top';
  @Prop({ mutable: true }) config?: SuperTabsConfig;
  @Prop({ mutable: true }) showIndicator: boolean = true;
  @Prop({ mutable: true }) color: string = 'primary';
  @Prop({ mutable: true, reflectToAttr: true }) scrollable: boolean = false;

  @Event() buttonClick!: EventEmitter<HTMLSuperTabButtonElement>;

  buttons!: HTMLSuperTabButtonElement[];

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

  @Method()
  onButtonClick(button: HTMLSuperTabButtonElement) {
    this.buttonClick.emit(button);
    this.setActiveTab(button.index as number);
  }

  @Method()
  setActiveTab(index: number) {
    this.activeTabIndex = index;
    this.alignIndicator(index);
    this.markButtonActive(this.buttons[index]);
  }

  @Method()
  setSelectedTab(index: number) {
    this.alignIndicator(index);
  }

  @Method()
  async moveContainer(scrollX: number, animate?: boolean) {
    await scrollEl(this.buttonsContainerEl, scrollX, animate? this.config!.transitionDuration : 0);
  }

  @Listen('window:resize')
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
    const coords = pointerCoord(ev);
    const vw = this.el.clientWidth;

    if (coords.x < this.leftThreshold || coords.x > vw - this.rightThreshold) {
      // ignore this gesture, it started in the side menu touch zone
      this.shouldCapture = false;
      return;
    }

    this.initialCoords = coords;
    this.lastPosX = coords.x;
  }

  @Listen('touchmove')
  async onTouchMove(ev: TouchEvent) {
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
    requestAnimationFrame(async () => {
      const scrollLeft = this.buttonsContainerEl.scrollLeft;
      const scrollX = getNormalizedScrollX(this.buttonsContainerEl, deltaX);

      if (scrollX === scrollLeft) {
        return;
      }
      await this.moveContainer(scrollX, false);
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
    const buttonsArray = [];

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

  private calcIndicatorAttrs(index: number) {
    const remainder = index % 1;
    const isDragging = remainder > 0;
    this.isDragging = isDragging;

    if (isDragging) {
      // we need to set position + scale based on % scrolled between the two tabs
      const buttonA = this.buttons[Math.floor(index)];
      const buttonB = this.buttons[Math.ceil(index)];

      const buttonAWidth = buttonA.clientWidth;
      const buttonAPosition = buttonA.offsetLeft;

      const buttonBWidth = buttonB.clientWidth;
      const buttonBPosition = buttonB.offsetLeft;

      const position = buttonAPosition + remainder * (buttonBPosition - buttonAPosition);
      const width = buttonAWidth + remainder * (buttonBWidth - buttonAWidth);

      this.indicatorPosition = position - this.el.scrollLeft;
      this.indicatorWidth = width;
    } else {
      // indicator should align perfectly with the active button
      const button = this.buttons[index];
      this.indicatorPosition = button.offsetLeft;
      this.indicatorWidth = button.clientWidth;
    }

    this.adjustContainerScroll(isDragging);
    this.setStyles();
  }

  private adjustContainerScroll(isDragging: boolean) {
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
      this.moveContainer(pos!, !isDragging);
    }
  }

  private alignIndicator(index: number) {
    if (!this.showIndicator) {
      return;
    }

    requestAnimationFrame(() => {
      this.calcIndicatorAttrs(index);
    });
  }

  setStyles() {
    if (!this.showIndicator || this.indicatorEl) {
      this.indicatorEl.style.setProperty('--st-indicator-position-x', this.indicatorPosition + 'px');
      this.indicatorEl.style.setProperty('--st-indicator-scale-x', String(this.indicatorWidth / 100));
      this.indicatorEl.style.setProperty('--st-indicator-transition-duration', this.isDragging ? '0' : `${this.config!.transitionDuration}ms`);
    }
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
        <super-tab-indicator ref={(ref: any) => this.indicatorEl = ref} toolbarPosition={this.toolbarPosition}/>}
      </div>,
    ];
  }
}
