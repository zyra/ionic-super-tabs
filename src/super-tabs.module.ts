import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import {SuperTabComponent} from "./components/super-tab/super-tab";
import {SuperTabsComponent} from "./components/super-tabs/super-tabs";

@NgModule({
    declarations: [
        SuperTabComponent,
        SuperTabsComponent
    ],
    imports: [
        IonicModule
    ],
    exports: [
        SuperTabComponent,
        SuperTabsComponent
    ]
})
export class SuperTabsModule { }