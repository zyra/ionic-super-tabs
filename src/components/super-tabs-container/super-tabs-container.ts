import {
  Component, Renderer2, ElementRef, Input, Output, EventEmitter, ViewChild, ViewEncapsulation,
  AfterViewInit, OnDestroy, NgZone
} from '@angular/core';
import { Platform } from 'ionic-angular';
import { SuperTabsPanGesture } from '../../super-tabs-pan-gesture';
import { SuperTabsConfig } from '../super-tabs/super-tabs';

@Component({
  selector: 'super-tabs-container',
  template: '<div #container><ng-content></ng-content></div>',
  encapsulation: ViewEncapsulation.None
})
export class SuperTabsContainer implements AfterViewInit, OnDestroy {

  /**
   * Component configuration
   * @type {SuperTabsConfig}
   */
  @Input()
  config: SuperTabsConfig;

  /**
   * Number of tabs
   * @type {number}
   */
  @Input()
  tabsCount: number = 0;

  /**
   * Selected tab index
   * @type {number}
   */
  @Input()
  selectedTabIndex: number;

  /**
   * Notifies when a tab is selected
   * @type {EventEmitter<Object>}
   */
  @Output()
  tabSelect: EventEmitter<{ index: number; changed: boolean; }> = new EventEmitter<{ index: number; changed: boolean; }>();

  /**
   * Notifies when the container is being dragged
   * @type {EventEmitter<TouchEvent>}
   */
  @Output()
  onDrag: EventEmitter<TouchEvent> = new EventEmitter<TouchEvent>();

  // View bindings

  /**
   * Container position
   * @type {number}
   */
  containerPosition: number = 0;

  // View children

  /**
   * The container wrapping all the tabs
   */
  @ViewChild('container')
  container: ElementRef;

  /**
   * Single tab width
   * @type {number}
   */
  tabWidth: number = 0;

  /**
   * Container width (sum of tab widths)
   * @type {number}
   */
  containerWidth: number = 0;


  // Animation stuff

  private minPosX: number;

  private maxPosX: number;

  private gesture: SuperTabsPanGesture;

  private globalSwipeEnabled: boolean = true;

  private swipeEnabledPerTab: {[index: number]: boolean} = {};

  constructor(
    private el: ElementRef,
    private rnd: Renderer2,
    private plt: Platform,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.init();
  }

  ngOnDestroy() {
    this.gesture && this.gesture.destroy();
  }

  enableTabsSwipe(enable: boolean) {
    this.globalSwipeEnabled = enable;
  }

  enableTabSwipe(tabIndex: number, enable: boolean) {
    this.swipeEnabledPerTab[tabIndex] = enable;
  }

  refreshDimensions() {
    this.calculateContainerWidth();
    this.setContainerWidth();
    this.refreshMinMax();
  }

  getNativeElement(): HTMLElement {
    return this.el.nativeElement;
  }

  private init() {

    this.refreshDimensions();

    this.gesture = new SuperTabsPanGesture(this.plt, this.container.nativeElement, this.config, this.rnd);

    this.gesture.onMove = (delta: number) => {
      if (this.globalSwipeEnabled === false) return;
      if (this.swipeEnabledPerTab[this.selectedTabIndex] === false) return;
      if ((this.containerPosition === this.maxPosX && delta >= 0) || (this.containerPosition === this.minPosX && delta <= 0)) return;
      this.containerPosition += delta;
      this.plt.raf(() => {
        this.onDrag.emit();
        this.moveContainer();
      })
    };

    this.gesture.onEnd = (shortSwipe: boolean, shortSwipeDelta?: number) => {
      if (this.globalSwipeEnabled === false) return;
      if (this.swipeEnabledPerTab[this.selectedTabIndex] === false) return;

      // get tab index based on container position
      let tabIndex = Math.round(this.containerPosition / this.tabWidth);

      // handle short swipes
      // only short swipe if we didn't change tab already in this gesture
      (tabIndex === this.selectedTabIndex) && shortSwipe && ((shortSwipeDelta < 0 && tabIndex++) || (shortSwipeDelta > 0 && tabIndex--));

      // get location based on tab index
      const position = Math.max(this.minPosX, Math.min(this.maxPosX, tabIndex * this.tabWidth));

      tabIndex = position / this.tabWidth;

      // move container if we changed position
      if (position !== this.containerPosition) {
        this.plt.raf(() => {
          this.moveContainer(true, position, () => this.ngZone.run(() => this.setSelectedTab(tabIndex)));
        })
      } else this.setSelectedTab(tabIndex);

    };
  }

  private setSelectedTab(index: number) {
    this.tabSelect.emit({index, changed: index !== this.selectedTabIndex});
    this.selectedTabIndex = index;
  }

  private calculateContainerWidth() {
    this.containerWidth = this.tabWidth * this.tabsCount;
  }

  private setContainerWidth() {
    this.rnd.setStyle(this.container.nativeElement, 'width', this.containerWidth + 'px');
  }

  slideTo(index: number, animate: boolean = true): void {
    this.plt.raf(() => this.moveContainer(animate, index * this.tabWidth));
  }

  private moveContainer(animate: boolean = false, positionX?: number, callback: Function = () => {}) {
    const el: HTMLElement = this.container.nativeElement;

    if (animate) {

      if (el.style[this.plt.Css.transform].indexOf('all') === -1) {
        this.rnd.setStyle(el, this.plt.Css.transition, `all ${this.config.transitionDuration}ms ${this.config.transitionEase}`);
      }

      this.rnd.setStyle(el, this.plt.Css.transform, `translate3d(${-1 * positionX}px, 0, 0)`);

      this.containerPosition = positionX;

    } else {

      if (positionX) {
        this.containerPosition = positionX;
      }

      if (el.style[this.plt.Css.transform] !== 'initial') {
        this.rnd.setStyle(el, this.plt.Css.transition, 'initial');
      }

      this.containerPosition = Math.max(this.minPosX, Math.min(this.maxPosX, this.containerPosition));

      this.rnd.setStyle(el, this.plt.Css.transform, `translate3d(${-1 * this.containerPosition}px, 0, 0)`);

    }
    callback();
  }

  private refreshMinMax(): void {
    this.minPosX = 0;
    this.maxPosX = (this.tabsCount - 1) * this.tabWidth;
  }

}
