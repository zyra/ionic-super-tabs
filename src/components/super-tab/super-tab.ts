import { Component, Input } from '@angular/core';

@Component({
  selector: 'super-tab',
  template: ''
})
export class SuperTab {

  @Input()
  tabRoot: any;

  @Input()
  navParams: any;

  @Input()
  title: string;

  @Input()
  icon: string;

}
