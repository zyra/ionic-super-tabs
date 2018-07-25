import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SuperTab } from './components/super-tab';
import { SuperTabButtonComponent } from './components/super-tab-button';
import { SuperTabs } from './components/super-tabs';
import { SuperTabsContainer } from './components/super-tabs-container';
import { SuperTabsToolbar } from './components/super-tabs-toolbar';
import { SuperTabsController } from './providers/super-tabs-controller';

@NgModule({
  declarations: [
    SuperTab,
    SuperTabs,
    SuperTabsToolbar,
    SuperTabsContainer,
    SuperTabButtonComponent
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
