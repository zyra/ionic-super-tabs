import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'super-tab-button',
  template: `
    <ion-icon *ngIf="!!icon" [name]="icon" [color]="color"></ion-icon>
    <span class="title" *ngIf="!!title" ion-text [color]="color">{{ title }}</span>
    <ion-badge mode="md" [color]="badgeColor">{{ badge }}</ion-badge>
    <div class="button-effect"></div>
  `,
  host: {
    '[class.selected]': 'selected',
    '(click)': 'onClick()',
    '[class.title-only]': '!!title && !icon',
    '[class.icon-only]': '!title && !!icon',
    '[class.title-and-icon]': '!!title && !!icon',
    'tappable': '',
    'role': 'button'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SuperTabButtonComponent {

  @Input()
  selected = false;

  @Input()
  title: string;

  @Input()
  icon: string;

  @Input()
  badge: number;

  @Input()
  badgeColor: string;

  @Input()
  color: string;

  @Output()
  select: EventEmitter<SuperTabButtonComponent> = new EventEmitter<SuperTabButtonComponent>();

  onClick() {
    this.select.emit(this);
  }

  constructor(private eRef: ElementRef) {
  }

  getNativeElement(): HTMLElement {
    return this.eRef.nativeElement;
  }

}
