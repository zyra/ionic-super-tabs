import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Segment, SegmentButton, Platform } from 'ionic-angular';

@Component({
  selector: 'super-tabs-toolbar',
  template: `
    <ion-toolbar [color]="color" mode="md" [class.scroll-tabs]="scrollTabs" [class.ease]="ease">
      <div class="tab-buttons-container" #tabButtonsContainer
           (touchstart)="onTabButtonsContainerTouch('touchstart', $event)"
           (touchmove)="onTabButtonsContainerTouch('touchmove', $event)">
        <ion-segment [color]="tabsColor" [(ngModel)]="selectedTab" mode="md" [style.transform]="'translate3d('+ (-1 * segmentPosition) +'px, 0, 0)'">
          <ion-segment-button text-wrap *ngFor="let tab of tabs; let i = index" [value]="i"
                              (ionSelect)="onTabSelect(i)">
            <ion-icon *ngIf="tab.icon" [name]="tab.icon"></ion-icon>
            {{tab.title}}
            <span class="badge {{ 'badge-md-' + badgeColor }}">15</span>
          </ion-segment-button>
        </ion-segment>
        <div class="indicator {{ 'button-md-' + indicatorColor }}" 
             [style.width]="indicatorWidth + 'px'"
             [style.transform]="'translate3d(' + (indicatorPosition - segmentPosition) + 'px, 0, 0)'"
             #indicator></div>
      </div>
    </ion-toolbar>`
})
export class SuperTabsToolbar {

  // Inputs

  @Input()
  color: string = '';

  @Input()
  tabsColor: string = '';

  @Input()
  badgeColor: string = '';

  @Input()
  scrollTabs: boolean = false;

  ease: boolean = false;

  indicatorPosition: number = 0;

  indicatorWidth: number = 0;

  @Input()
  indicatorColor: string = '';

  @Input()
  selectedTab: number = 0;


  // Outputs

  @Output()
  tabSelect: EventEmitter<any> = new EventEmitter<any>();

  // View children

  @ViewChildren(SegmentButton)
  private segmentButtons: QueryList<SegmentButton>;

  // View bindings

  /**
   * @private
   */
  segmentPosition: number = 0;

  // Public values to be accessed by parent SuperTabs component

  /**
   * The width of each button
   */
  segmentButtonWidths: number[] = [];

  /**
   * The segment width
   */
  segmentWidth: number = 0;

  tabs: any[] = [];


  // Private values for tracking, calculations ...etc

  /**
   * Used to handle manual tab buttons container scrolling. Tracks the last touch position to determine how much to scroll by.
   */
  private lastTouchPositionX: number;

  /**
   * Indicates whether this component is initialized
   */
  private init: boolean = false;


  // Initialization methods
  constructor(
    private el: ElementRef,
    private plt: Platform
  ) {}

  ngAfterViewInit() {
    // this.segment.writeValue(this.selectedTab);
    this.init = true;

    if (this.scrollTabs) {
      this.plt.timeout(() => {
        this.indexSegmentButtonWidths();
      }, 10);
    }
  }

  initToolbar() {

  }

  // Event handlers
  onTabButtonsContainerTouch(name: string, ev: any) {
    if (!this.scrollTabs) return;
    switch(name) {
      case 'touchstart':
        this.lastTouchPositionX = ev.touches[0].clientX;
        break;

      case 'touchmove':
        let newPos = ev.touches[0].clientX;
        let delta = this.lastTouchPositionX - newPos;
        this.lastTouchPositionX = newPos;
        let newCPos = this.segmentPosition + delta;

        let mw: number = this.el.nativeElement.offsetWidth,
          cw: number = this.segmentWidth;

        let min = 0, max = cw - mw;

        if (newCPos < min) newCPos = min;
        if (newCPos > max) newCPos = max;
        this.setSegmentPosition(newCPos);
        break;
    }
  }

  onTabSelect(index: number) {
    this.tabSelect.emit(index);
  }


  // Public methods
  setIndicatorProperties(position: number, width: number, shouldEase: boolean = false) {
    shouldEase && this.toggleEase();
    this.setIndicatorPosition(position, false);
    this.setIndicatorWidth(width, false);
  }

  setIndicatorPosition(position?: number, shouldEase: boolean = false) {
    shouldEase && this.toggleEase();
    this.indicatorPosition = position;
  }

  setIndicatorWidth(width: number, shouldEase: boolean = false) {
    shouldEase && this.toggleEase();
    this.indicatorWidth = width;
  }

  setSegmentPosition(position: number) {
    this.segmentPosition = position;
  }


  // Private methods

  private toggleEase() {
    this.ease = true;
    setTimeout(() => this.ease = false, 150);
  }

  /**
   * Indexes the segment button widths
   */
  private indexSegmentButtonWidths() {
    let index = [], total = 0;

    this.segmentButtons.forEach((btn: SegmentButton, i: number) => {
      index[i] = <ElementRef>(<any>btn)._elementRef.nativeElement.offsetWidth;
      total += index[i] + 10;
    });

    this.segmentButtonWidths = index;
    this.segmentWidth = total;
  }

}
