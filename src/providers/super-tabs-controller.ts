import { Injectable } from '@angular/core';

@Injectable()
export class SuperTabsController {

  setBadge(tabId: string, value: number) {

  }

  clearBadge(tabId: string) {

  }

  increaseBadge(tabId: string, increaseBy: number = 1) {

  }

  decreaseBadge(tabId: string, decreaseBy: number = 1) {

  }

  enableSwipe(tabsId: string, enable: boolean) {

  }

  enableSwipePerTab(tabsId: string, tabId: string, enable: boolean) {

  }

  /**
   * Enable or disable a tab. This will add/remove the tab from DOM.
   * @param tabsId
   * @param tabId
   * @param enable
   */
  enableTab(tabsId: string, tabId: string, enable: boolean) {

  }

}
