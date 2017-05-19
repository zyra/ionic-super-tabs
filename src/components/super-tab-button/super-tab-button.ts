import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'super-tab-button',
  template: `
    <ion-icon *ngIf="icon" [name]="icon"></ion-icon>
    <span *ngIf="title">{{ title }}</span>
    <span class="badge {{ 'badge-md-' + badgeColor }}">{{ badge }}</span>
  `,
  host: {
    '[class.selected]': 'selected',
    '(click)': 'onClick($event)'
  }
})
export class SuperTabButton {

  @Input()
  selected: boolean = false;

  @Input()
  title: string;

  @Input()
  icon: string;

  @Input()
  badge: number;

  @Output()
  select: EventEmitter<SuperTabButton> = new EventEmitter<SuperTabButton>();

  onClick(ev: any) {
    this.select.emit(this);
  }

}
