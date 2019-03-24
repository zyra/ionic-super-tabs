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

function scroll(el: Element, startX: number, x: number, startTime: number, duration: number, callback: Function) {
  const currentTime = window.performance.now();
  const scrollX = getScrollCoord(startX, x, startTime, currentTime, duration);
  el.scrollTo(scrollX, 0);

  if (currentTime - startTime >= duration) {
    callback();
    return;
  }

  requestAnimationFrame(() => scroll(el, startX, x, startTime, duration, callback));
}

export const scrollEl = async (el: Element, x: number, duration: number = 300) => {
  const startX = el.scrollLeft;
  const now = window.performance.now();

  return new Promise<void>(resolve => {
    requestAnimationFrame(() => scroll(el, startX, x, now, duration, resolve));
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

export function getNormalizedScrollX(el: HTMLElement, delta?: number) {
  const minX = 0;
  const maxX = el.scrollWidth - el.clientWidth;
  let scrollX = getScrollX(el, delta);

  scrollX = Math.max(minX, Math.min(maxX, scrollX));

  return scrollX;
}
