import {
  AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, Renderer,
  ViewChild
} from '@angular/core';
import { SuperTabComponent } from "../super-tab/super-tab";
import { NavController, Slides, Toolbar } from "ionic-angular";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

@Component({
  selector: 'super-tabs',
  template: `
      <ion-toolbar [color]="toolbarColor" #toolbar mode="md">
          <ion-segment [color]="tabsColor" [(ngModel)]="selectedTabIndex" mode="md">
              <ion-segment-button *ngFor="let tab of tabs; let i = index" [value]="i" (ionSelect)="onTabSelect(i)">
                  <ion-icon *ngIf="tab.icon" [name]="tab.icon"></ion-icon>
                  {{tab.title}}
              </ion-segment-button>
          </ion-segment>
          <div class="slide" #slide [style.left]="slidePosition" [class.ease]="shouldSlideEase" [style.width]="slideWidth"></div>
      </ion-toolbar>
      <ion-slides [style.height]="slidesHeight + 'px'" (ionSlideDrag)="onDrag($event)" (ionSlideWillChange)="onSlideWillChange()" (ionSlideDidChange)="onSlideDidChange()" [initialSlide]="selectedTabIndex">
          <ion-slide *ngFor="let tab of tabs">
              <ion-nav [root]="tab.tabRoot" [rootParams]="tab.navParams"></ion-nav>
          </ion-slide>
      </ion-slides>
  `
})
export class SuperTabsComponent implements OnDestroy, AfterViewInit {

  /**
   * The parent page NavController.
   * This can be used to push a new view from the parent page.
   */
  @Input()
  rootNavCtrl: NavController;

  /**
   * Color of the toolbar behind the tab buttons
   */
  @Input()
  toolbarColor: string;

  /**
   * Color of the tab buttons' text and/or icon
   */
  @Input()
  tabsColor: string;

  /**
   * Color of the slider that moves based on what tab is selected
   */
  @Input()
  sliderColor: string = 'primary';

  /**
   * Height of the tabs
   */
  @Input()
  set height(val: string) {
    this.rnd.setElementStyle(this.el.nativeElement, 'height', val);
  }

  /**
   * The initial selected tab index
   * @param val {number} tab index
   */
  @Input()
  set selectedTabIndex(val: number) {
    this._selectedTabIndex = val;
    this.alignSlidePosition();
  }

  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  @ContentChildren(SuperTabComponent)
  private superTabs: QueryList<SuperTabComponent>;

  /**
   * The tabs
   */
  tabs: SuperTabComponent[] = [];

  @ViewChild(Slides)
  private slides: Slides;

  @ViewChild('toolbar')
  private toolbar: Toolbar;

  @ViewChild('slide')
  private slider: ElementRef;

  /**
   * @private
   */
  slidesHeight: number = 0;
  /**
   * @private
   */
  maxSlidePosition: number;
  /**
   * @private
   */
  slidePosition = '0';
  /**
   * @private
   */
  slideWidth = '0';
  /**
   * @private
   */
  shouldSlideEase: boolean = false;

  private _selectedTabIndex = 0;

  private validSliderLocations: number[] = [];

  private screenOrientationWatch: any;

  constructor( private el: ElementRef, private rnd: Renderer) {
    // re-adjust the height of the slider when the orientation changes
    this.screenOrientationWatch = Observable.fromEvent(window, 'orientationchange').subscribe(() => this.setHeights());
  }

  ngAfterViewInit() {
    // take the tabs from the query and put them in a regular array to make life easier
    this.superTabs.forEach(tab => {
      tab.navParams = tab.navParams || {};
      tab.navParams.rootNavCtrl = this.rootNavCtrl;
      this.tabs.push(tab);
    });

    // the width of the "slide", should be equal to the width of a single `ion-segment-button`
    // we'll just calculate it instead of querying for a segment button
    this.slideWidth = this.el.nativeElement.offsetWidth / this.tabs.length + 'px';

    // we need this to make sure the "slide" thingy doesn't move outside the screen
    this.maxSlidePosition = this.el.nativeElement.offsetWidth - (this.el.nativeElement.offsetWidth / this.tabs.length);

    // set slide speed to match slider
    this.slides.speed = 250;

    // set color of the slider
    this.rnd.setElementClass(this.slider.nativeElement, 'button-md-' + this.sliderColor, true);

    // we waiting for 100ms just to give `ion-icon` some time to decide if they want to show up or not
    // if we check height immediately, we will get the height of the header without the icons
    setTimeout(this.setHeights.bind(this), 100);

    // lets figure out what are the possible locations for the slider thingy to be at
    // this is needed because if the user moves the slider a bit, and that movement doesn't result in a slide change
    // then we need to reset the location of the slider
    const segmentButtonWidth = this.slides.renderedWidth / this.tabs.length;
    this.validSliderLocations = [];
    for (let i = 0; i < this.tabs.length; i++) {
      this.validSliderLocations.push(i * segmentButtonWidth);
    }

    this.slides.ionSlideTouchEnd.subscribe(() => this.ensureSliderLocationIsValid());

  }

  ngOnDestroy() {
    if (this.screenOrientationWatch && this.screenOrientationWatch.unsubscribe) {
      this.screenOrientationWatch.unsubscribe();
    }
  }

  /**
   * We listen to drag events to move the "slide" thingy along with the slides
   * @param ev
   */
  onDrag(ev: Slides) {
    if (ev._translate > 0 || ev._translate < -((this.tabs.length -1) * this.slides.renderedWidth)) {
      // over sliding
      return;
    }
    const percentage = Math.abs(ev._translate / ev._virtualSize);
    const singleSlideSize = ev._renderedSize;

    let slidePosition = percentage * singleSlideSize;

    if (slidePosition > this.maxSlidePosition) {
      slidePosition = this.maxSlidePosition;
    }

    this.slidePosition = slidePosition + 'px';
  }

  /**
   * The slide will change because the user stopped dragging, or clicked on a segment button
   * Let's make sure the segment button is in alignment with the slides
   * Also, lets animate the "slide" element
   */
  onSlideWillChange() {
    if (this.slides.getActiveIndex() <= this.tabs.length) {
      this.shouldSlideEase = true;
      this.selectedTabIndex = this.slides.getActiveIndex();
    }
  }

  /**
   * We need to disable animation after the slide is done changing
   * Any further movement should happen instantly as the user swipes through the tabs
   */
  onSlideDidChange() {
    this.shouldSlideEase = false;
  }

  /**
   * Runs when the user clicks on a segment button
   * @param index
   */
  onTabSelect(index: number) {
    if (index <= this.tabs.length) {
      this.slides.slideTo(index);
    }
  }

  private ensureSliderLocationIsValid() {
    if (this.validSliderLocations.indexOf(Number(this.slidePosition)) === -1) {
      // invalid location
      // lets move the slider to the right position
      this.shouldSlideEase = true;
      this.alignSlidePosition();
      setTimeout(() => this.shouldSlideEase = false, 250); // it takes 250ms for the slider to move
    }
  }

  /**
   * Aligns slide position with selected tab
   */
  private alignSlidePosition() {
    let slidePosition = this.selectedTabIndex * this.slides.renderedWidth / this.tabs.length;
    this.slidePosition = slidePosition <= this.maxSlidePosition ? slidePosition + 'px' : this.maxSlidePosition + 'px';
  }

  /**
   * Sets the height of ion-slides and it's position from the top of the page
   */
  private setHeights() {
    this.slidesHeight = this.el.nativeElement.offsetHeight - this.toolbar.getNativeElement().offsetHeight;
  }


}
