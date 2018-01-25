import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SuperTab } from './components/super-tab';
import { SuperTabs } from './components/super-tabs';
import { SuperTabsController } from './providers/super-tabs-controller';
import { SuperTabsToolbar } from './components/super-tabs-toolbar';
import { SuperTabsContainer } from './components/super-tabs-container';
import { SuperTabButton } from './components/super-tab-button';

@NgModule({
  declarations: [
    SuperTab,
    SuperTabs,
    SuperTabsToolbar,
    SuperTabsContainer,
    SuperTabButton
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
