import { SuperTabComponent } from './super-tab/super-tab.component';

export interface SuperTabsControllerConfig {
  animationDuration: number;
  leftThreshold: number;
  rightThreshold: number;
}

export interface SuperTabChangeEvent {
  tab: SuperTabComponent;
  index: number;
}

export interface SuperTabButtonClickEvent {
  tab: SuperTabComponent;
  index: number;
  changed: boolean;
}

export abstract class SuperTabsAnimatableComponent {
  abstract setPosition(position: number, duration: number);
}

export type STCoord = {
  x: number;
  y: number;
}

export function pointerCoord(ev: any): STCoord {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (ev.pageX !== undefined) {
      return { x: ev.pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
}

