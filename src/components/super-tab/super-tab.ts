import { Component, Input } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'super-tab',
  template: ''
})
export class SuperTabComponent {

  @Input()
  tabRoot: any;

  @Input()
  navParams: any;

  @Input()
  title: string;

  @Input()
  icon: string;

}
