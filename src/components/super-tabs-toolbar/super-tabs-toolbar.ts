import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChildren, QueryList,
  ViewEncapsulation, ViewChild, Renderer2, AfterViewInit, OnDestroy
} from '@angular/core';
import {SegmentButton, Platform, Segment, DomController} from 'ionic-angular';
import { SuperTabsPanGesture } from '../../super-tabs-pan-gesture';
import { SuperTabsConfig } from '../super-tabs/super-tabs';

@Component({
  selector: 'super-tabs-toolbar',
  template: `
    <ion-toolbar [color]="color" mode="md" [class.scroll-tabs]="scrollTabs">
      <div class="tab-buttons-container" #tabButtonsContainer>
        <div *ngIf="tabsPlacement === 'bottom'" class="indicator {{ 'button-md-' + indicatorColor }}" #indicator></div>
        <ion-segment [color]="tabsColor" [(ngModel)]="selectedTab" mode="md">
          <ion-segment-button text-wrap *ngFor="let tab of tabs; let i = index" [value]="i" (ionSelect)="selectedTab !== i && onTabSelect(i)">
            <ion-icon *ngIf="tab.icon" [name]="tab.icon"></ion-icon>
            {{tab.title}}
            <span [hidden]="tab.badge <= 0" class="badge {{ 'badge-md-' + badgeColor }}">{{tab.badge}}</span>
          </ion-segment-button>
        </ion-segment>
        <div *ngIf="tabsPlacement === 'top'" class="indicator {{ 'button-md-' + indicatorColor }}" #indicator></div>
      </div>
    </ion-toolbar>`,
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

  @ViewChildren(SegmentButton)
  private segmentButtons: QueryList<SegmentButton>;

  @ViewChild('tabButtonsContainer')
  private tabButtonsContainer: ElementRef;

  @ViewChild('indicator')
  private indicator: ElementRef;

  @ViewChild(Segment)
  private segment: Segment;

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
    this.toggleAnimation(this.indicator, animate);
    this.setIndicatorWidth(width, animate);
    this.setIndicatorPosition(position, animate);
  }

  setIndicatorPosition(position: number, animate?: boolean) {
    this.indicatorPosition = position;
    this.toggleAnimation(this.indicator, animate);
    this.domCtrl.write(() => {
      this.rnd.setStyle(this.indicator.nativeElement, this.plt.Css.transform, 'translate3d(' + (position - this.segmentPosition) + 'px, 0, 0)');
    });
  }

  setIndicatorWidth(width: number, animate?: boolean) {
    this.indicatorWidth = width;
    this.toggleAnimation(this.indicator, animate);
    this.domCtrl.write(() => {
      this.rnd.setStyle(this.indicator.nativeElement, 'width', width + 'px');
    });
  }

  setSegmentPosition(position: number, animate?: boolean) {
    this.segmentPosition = position;
    this.toggleAnimation(this.segment.getElementRef(), animate);
    this.domCtrl.write(() => {
      this.rnd.setStyle(this.segment.getNativeElement(), this.plt.Css.transform, `translate3d(${-1 * position}px,0,0)`);
    });
    this.setIndicatorPosition(this.indicatorPosition, animate);
  }

  /**
   * Enables/disables animation
   * @param el
   * @param animate
   */
  private toggleAnimation(el: ElementRef, animate: boolean) {

    if (!this.config || this.config.transitionDuration === 0)
      return;

    this.domCtrl.read(() => {
      const _el: HTMLElement = el.nativeElement;

      this.domCtrl.write(() => {
        if (animate) {
          // ease isn't enabled and needs to be enabled
          this.rnd.setStyle(_el, this.plt.Css.transition, `all ${this.config.transitionDuration}ms ${this.config.transitionEase}`);
        } else {
          // ease is already enabled and needs to be disabled
          this.rnd.setStyle(_el, this.plt.Css.transition, 'initial');
        }
      })
    })

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
