import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChildren, QueryList,
  ViewEncapsulation, ViewChild, Renderer2, AfterViewInit, OnDestroy
} from '@angular/core';
import { Platform, DomController } from 'ionic-angular';
import { SuperTabsPanGesture } from '../super-tabs-pan-gesture';
import { SuperTabsConfig } from './super-tabs';
import { SuperTabButton } from "./super-tab-button";

@Component({
  selector: 'super-tabs-toolbar',
  template: `
    <ion-toolbar [color]="color" mode="md" [class.scroll-tabs]="scrollTabs">
      <div class="tab-buttons-container" #tabButtonsContainer>
        <div *ngIf="tabsPlacement === 'bottom'" class="indicator {{ 'button-md-' + indicatorColor }}" #indicator></div>
        <div class="tab-buttons" #tabButtons>
          <super-tab-button *ngFor="let tab of tabs; let i = index" (select)="onTabSelect(i)" [title]="tab.title" [icon]="tab.icon" [badge]="tab.badge" [selected]="selectedTab === i" [color]="tabsColor" [badgeColor]="badgeColor"></super-tab-button>
        </div>
        <div *ngIf="tabsPlacement === 'top'" class="indicator {{ 'button-md-' + indicatorColor }}" #indicator></div>
      </div>
    </ion-toolbar>
  `,
  encapsulation: ViewEncapsulation.None
})
export class SuperTabsToolbar implements AfterViewInit, OnDestroy {

  @Input()
  color: string = '';

  @Input()
  tabsColor: string = '';

  @Input()
  badgeColor: string = '';

  @Input()
  scrollTabs: boolean = false;

  @Input()
  indicatorColor: string = '';

  @Input()
  selectedTab: number = 0;

  @Input()
  config: SuperTabsConfig;

  @Input()
  tabsPlacement: string;

  indicatorPosition: number = 0;

  indicatorWidth: number = 0;

  @Output()
  tabSelect: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren(SuperTabButton)
  private tabButtons: QueryList<SuperTabButton>;

  @ViewChild('tabButtonsContainer')
  private tabButtonsContainer: ElementRef;

  @ViewChild('indicator')
  private indicator: ElementRef;

  @ViewChild('tabButtons')
  private tabButtonsBar: ElementRef;

  /**
   * @private
   */
  segmentPosition: number = 0;

  /**
   * The width of each button
   */
  segmentButtonWidths: number[] = [];

  /**
   * The segment width
   */
  segmentWidth: number = 0;

  tabs: any[] = [];

  private gesture: SuperTabsPanGesture;

  private animationState = {
    indicator: false,
    segment: false
  };

  constructor(
    private el: ElementRef,
    private plt: Platform,
    private rnd: Renderer2,
    private domCtrl: DomController
  ) {}

  ngAfterViewInit() {
    this.gesture = new SuperTabsPanGesture(this.plt, this.tabButtonsContainer.nativeElement, this.config, this.rnd);
    this.gesture.onMove = (delta: number) => {

      let newCPos = this.segmentPosition + delta;

      let mw: number = this.el.nativeElement.offsetWidth,
        cw: number = this.segmentWidth;

      newCPos = Math.max(0, Math.min(newCPos, cw - mw));
      this.setSegmentPosition(newCPos);

    };

    if (this.scrollTabs) {
      this.plt.timeout(() => {
        this.indexSegmentButtonWidths();
      }, 10);
    }
  }

  ngOnDestroy() {
    this.gesture && this.gesture.destroy();
  }

  onTabSelect(index: number) {
    this.tabSelect.emit(index);
  }

  alignIndicator(position: number, width: number, animate?: boolean) {
    this.setIndicatorProperties(width, position, animate);
  }

  setIndicatorPosition(position: number, animate?: boolean) {
    this.setIndicatorProperties(this.indicatorWidth, position, animate);
  }

  setIndicatorWidth(width: number, animate?: boolean) {
    this.setIndicatorProperties(width, this.indicatorPosition, animate);
  }

  setIndicatorProperties(width: number, position: number, animate?: boolean) {
    this.indicatorWidth = width;
    this.indicatorPosition = position;
    const scale = width / 100;
    this.toggleAnimation('indicator', animate);
    this.rnd.setStyle(this.indicator.nativeElement, this.plt.Css.transform,  'translate3d(' + (position - this.segmentPosition) + 'px, 0, 0) scale3d(' + scale + ', 1, 1)')
  }

  setSegmentPosition(position: number, animate?: boolean) {
    this.segmentPosition = position;
    this.toggleAnimation('segment', animate);
    this.rnd.setStyle(this.tabButtonsBar.nativeElement, this.plt.Css.transform, `translate3d(${-1 * position}px,0,0)`);
    this.setIndicatorPosition(this.indicatorPosition, animate);
  }


  /**
   * Enables/disables animation
   * @param el
   * @param animate
   */
  private toggleAnimation(el: 'indicator' | 'segment', animate: boolean) {

    if (!this.config || this.config.transitionDuration === 0)
      return;

    // only change style if the value changed
    if (this.animationState[el] === animate) return;

    this.animationState[el] = animate;

    const _el: HTMLElement = el === 'indicator'? this.indicator.nativeElement : this.tabButtonsBar.nativeElement;
    const value: string = animate? `all ${this.config.transitionDuration}ms ${this.config.transitionEase}` : 'initial';

    this.rnd.setStyle(_el, this.plt.Css.transition, value);

  }

  /**
   * Indexes the segment button widths
   */
  indexSegmentButtonWidths() {
    let index = [], total = 0;

    this.tabButtons.forEach((btn: SuperTabButton, i: number) => {
      index[i] = btn.getNativeElement().offsetWidth;
      total += index[i];
    });

    this.segmentButtonWidths = index;
    this.segmentWidth = total;
  }

}
