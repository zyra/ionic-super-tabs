import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { appInit } from './app-init';
import { SuperTab, SuperTabButton, SuperTabs, SuperTabsContainer, SuperTabsToolbar } from './directives/proxies';

export const DECLARATIONS = [
  SuperTab,
  SuperTabButton,
  SuperTabs,
  SuperTabsContainer,
  SuperTabsToolbar,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [CommonModule],
})
export class SuperTabsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SuperTabsModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: appInit,
          multi: true,
          deps: [DOCUMENT],
        },
      ],
    };
  }
}
