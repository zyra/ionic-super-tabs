import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SuperTab } from './components/super-tab/super-tab';
import { SuperTabs } from './components/super-tabs/super-tabs';
import { SuperTabsController } from './providers/super-tabs-controller';
import { SuperTabsToolbar } from './components/super-tabs-toolbar/super-tabs-toolbar';

@NgModule({
  declarations: [
    SuperTab,
    SuperTabs,
    SuperTabsToolbar
  ],
  imports: [
    IonicModule
  ],
  exports: [
    SuperTab,
    SuperTabs
  ]
})
export class SuperTabsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SuperTabsModule,
      providers: [
        SuperTabsController
      ]
    };
  }
}
