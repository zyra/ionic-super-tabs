import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SuperTab, SuperTabButton, SuperTabs, SuperTabsContainer, SuperTabsToolbar } from './directives/proxies';

const DECLARATIONS = [
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
export class SuperTabsModule {}
