import {Component, ContentChildren, Input, QueryList, ViewChild} from '@angular/core';
import {SuperTabComponent} from "../super-tab/super-tab";
import {Header, Platform, Slides} from "ionic-angular";

/*
  Generated class for the SuperTabs component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'super-tabs',
  template: `
      <ion-header>
          <ion-navbar color="dark">
              <ion-title>{{pageTitle}}</ion-title>
          </ion-navbar>
          <ion-toolbar color="dark">
              <ion-segment color="light" [(ngModel)]="selectedTabIndex">
                  <ion-segment-button *ngFor="let tab of tabs; let i = index" [value]="i" (ionSelect)="onTabSelect(i)">
                      <ion-icon *ngIf="tab.icon" [name]="tab.icon"></ion-icon>
                      {{tab.title}}
                  </ion-segment-button>
              </ion-segment>
              <div class="slide" #slide [style.left]="slidePosition" [class.ease]="shouldSlideEase" [style.width]="slideWidth"></div>
          </ion-toolbar>
      </ion-header>
      <ion-slides [style.margin-top]="headerHeight + 'px'" [style.height]="slidesHeight + 'px'" (ionSlideDrag)="onDrag($event)" (ionSlideWillChange)="onSlideWillChange()" (ionSlideDidChange)="onSlideDidChange()" [initialSlide]="selectedTabIndex">
          <ion-slide *ngFor="let tab of tabs">
              <ion-nav [root]="tab.tabRoot"></ion-nav>
          </ion-slide>
      </ion-slides>
  `
})
export class SuperTabsComponent {

  @ContentChildren(SuperTabComponent) superTabs: QueryList<SuperTabComponent>;

  tabs: SuperTabComponent[] = [];

  @ViewChild(Slides) slides: Slides;

  @ViewChild(Header) header: Header;
  headerHeight: number = 0;
  slidesHeight: number = 0;

  _selectedTabIndex = 0;
  @Input()
  set selectedTabIndex(val: number) {
    if (val >= this.tabs.length) {
      return;
    }
    this._selectedTabIndex = val;
    let slidePosition = val * this.slides.renderedWidth / this.tabs.length;
    this.slidePosition = slidePosition <= this.maxSlidePosition ? slidePosition + 'px' : this.maxSlidePosition + 'px';
    this.pageTitle = this.tabs[this.selectedTabIndex].title;
  }

  get selectedTabIndex(): number {
    return this._selectedTabIndex;
  }

  maxSlidePosition: number;
  slidePosition = '0';
  slideWidth = '0';
  shouldSlideEase: boolean = false;
  pageTitle: string = '';

  constructor(private platform: Platform) {
    console.log('Hello SuperTabs Component');
  }

  /**
   * We listen to drag events to move the "slide" thingy along with the slides
   * // TODO figure out a way to reset the "slide" position after the user is done dragging. ATM it gets stuck if the user swipes partially without changing the tab.
   * @param ev
   */
  onDrag(ev: Slides) {
    if (ev._translate > 0) return;
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

  ngAfterViewInit() {
    // take the tabs from the query and put them in a regular array to make life easier
    this.superTabs.forEach(tab => this.tabs.push(tab));

    // set page title based on the selected page
    this.pageTitle = this.tabs[this.selectedTabIndex].title;

    // the width of the "slide", should be equal to the width of a single `ion-segment-button`
    // we'll just calculate it instead of querying for a segment button
    this.slideWidth = this.platform.width() / this.tabs.length + 'px';

    // we need this to make sure the "slide" thingy doesn't move outside the screen
    this.maxSlidePosition = this.platform.width() - (this.platform.width() / this.tabs.length);

    // we waiting for 100ms just to give `ion-icon` some time to decide if they want to show up or not
    // if we check height immediately, we will get the height of the header without the icons
    setTimeout(this.setHeights.bind(this), 100);

  }

  /**
   * Sets the height of ion-slides and it's position from the top of the page
   */
  private setHeights() {
    this.headerHeight = this.header.getNativeElement().offsetHeight;
    this.slidesHeight = this.platform.height() - this.headerHeight;
  }


}
