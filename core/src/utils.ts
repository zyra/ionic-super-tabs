import { QueueApi } from '@stencil/core';
import { SuperTabsConfig } from './interface';

export const DEFAULT_CONFIG: SuperTabsConfig = {
  dragThreshold: 10,
  allowElementScroll: false,
  maxDragAngle: 40,
  sideMenuThreshold: 50,
  transitionDuration: 300,
  shortSwipeDuration: 300,
};

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

export const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

function getScrollCoord(start: number, dest: number, startTime: number, currentTime: number, duration: number) {
  const time = Math.min(1, (currentTime - startTime) / duration);
  const timeFn = easeInOutCubic(time);
  return Math.ceil((timeFn * (dest - start)) + start);
}

function scroll(el: Element, startX: number, startY: number, x: number, y: number, startTime: number, duration: number, queue: QueueApi) {
  const currentTime = window.performance.now();
  const scrollX = startX === x ? x : getScrollCoord(startX, x, startTime, currentTime, duration);
  const scrollY = startY === y ? y : getScrollCoord(startY, y, startTime, currentTime, duration);

  el.scrollTo(scrollX, scrollY);

  if (currentTime - startTime >= duration) {
    return;
  }

  queue.write(() => {
    scroll(el, startX, startY, x, y, startTime, duration, queue);
  });
}

export const scrollEl = (el: Element, x: number, y: number, duration: number = 300, queue: QueueApi) => {
  if (duration <= 0) {
    queue.write(() => {
      el.scrollTo(x, y);
    });
    return;
  }

  queue.read(() => {
    const startX = el.scrollLeft;
    const startY = el.scrollTop;
    const now = window.performance.now();

    queue.write(() => {
      scroll(el, startX, startY, x, y, now, duration, queue);
    });
  });
};

export function checkGesture(newCoords: STCoord, initialCoords: STCoord, config: SuperTabsConfig): boolean | undefined {
  if (!initialCoords) {
    return;
  }

  const radians = config.maxDragAngle! * (Math.PI / 180),
    maxCosine = Math.cos(radians),
    deltaX = newCoords.x - initialCoords.x,
    deltaY = newCoords.y - initialCoords.y,
    distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance >= config.dragThreshold!) {
    // swipe is long enough
    // lets check the angle
    const angle = Math.atan2(deltaY, deltaX),
      cosine = Math.cos(angle);

    return Math.abs(cosine) > maxCosine;
  }

  return;
}

export function getScrollX(el: HTMLElement, delta?: number) {
  return el.scrollLeft + (typeof delta === 'number' ? delta : 0);
}

export function getScrollY(el: HTMLElement, delta?: number) {
  return el.scrollTop + (typeof delta === 'number' ? delta : 0);
}

export function getNormalizedScrollX(el: HTMLElement, delta?: number) {
  const minX = 0;
  const maxX = el.scrollWidth - el.clientWidth;
  let scrollX = getScrollX(el, delta);

  scrollX = Math.max(minX, Math.min(maxX, scrollX));

  return scrollX;
}
