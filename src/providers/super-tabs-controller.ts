import { Injectable } from '@angular/core';
import { SuperTabs } from '../components/super-tabs';

@Injectable()
export class SuperTabsController {

  private instances: SuperTabs[] = [];

  setBadge(tabId: string, value: number, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.setBadge(tabId, value);
  }

  clearBadge(tabId: string, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.clearBadge(tabId);
  }

  increaseBadge(tabId: string, increaseBy: number = 1, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.increaseBadge(tabId, increaseBy);
  }

  decreaseBadge(tabId: string, decreaseBy: number = 1, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.decreaseBadge(tabId, decreaseBy);
  }

  /**
   * Enables/disables swiping on a specific tabs instance
   * @param enable
   * @param [tabsId]
   */
  enableTabsSwipe(enable: boolean, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.enableTabsSwipe(enable);
  }

  /**
   * Enables/disables swiping when this tab is active
   * @param tabId
   * @param enable
   * @param [tabsId]
   */
  enableTabSwipe(tabId: string, enable: boolean, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.enableTabSwipe(tabId, enable);
  }

  showToolbar(show: boolean, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.showToolbar(show);
  }

  slideTo(tabIndexOrId: string | number, tabsId?: string) {
    const instance = this.getInstance(tabsId);
    instance && instance.slideTo(tabIndexOrId);
  }

  /**
   * @private
   */
  registerInstance(instance: SuperTabs) {
    this.instances.push(instance);
  }

  /**
   * @private
   */
  unregisterInstance(id: string) {
    const instanceIndex = this.getInstanceIndex(id);
    if (instanceIndex > -1)
      this.instances.splice(instanceIndex, 1);
  }

  private getInstanceIndex(id: string): number {
    return this.instances.findIndex((instance: SuperTabs) => instance.id === id);
  }

  private getInstance(id?: string): SuperTabs {
    return (!!id && this.instances[this.getInstanceIndex(id)]) || this.instances[0];
  }

}
