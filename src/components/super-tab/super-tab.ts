import { Component, Input } from '@angular/core';

@Component({
  selector: 'super-tab',
  template: ''
})
export class SuperTabComponent {

  @Input()
  tabRoot: any;

  @Input()
  title: string;

  @Input()
  icon: string;

}
