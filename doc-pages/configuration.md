# Configuration

Configuring ***Super Tabs*** can be done by setting the `config` property on a `<super-tab>` element.

Example:
```html
<!-- home.page.html -->
<super-tabs [config]="config">
```
```ts
<!-- home.page.ts -->
  ...
  
  config: SuperTabsConfig = {
    sideMenu: 'left',
    shortSwipeDuration: 180,
  };
```

## Defaults
```ts
export const DEFAULT_CONFIG: SuperTabsConfig = {
  dragThreshold: 10,
  allowElementScroll: false,
  maxDragAngle: 40,
  sideMenuThreshold: 50,
  transitionDuration: 300,
  shortSwipeDuration: 300,
  debug: false,
  avoidElements: false,
};
```

## Reference
```ts
/**
   * Max drag angle in degrees.
   *
   * Defaults to `40`
   */
  maxDragAngle?: number;

  /**
   * Drag threshold in pixels.
   *
   * This value defines how far the user have to swipe for the swipe to be treated as a swipe gesture.
   *
   * Defaults to `20`
   */
  dragThreshold?: number;

  /**
   * Allows elements inside tabs to be dragged or scrolled through.
   *
   * Setting this value to `true` will allow touch events to be propagated to child components.
   *
   * Defaults to `false`.
   */
  allowElementScroll?: boolean;

  /**
   * Transition duration in milliseconds.
   *
   * This value is used for all transitions and animations.
   *
   * Defaults to `150`.
   */
  transitionDuration?: number;

  /**
   * Side menu location.
   *
   * If this value is set to `right` or `left`, the super tabs component will avoid listening to swipe events
   * in the specified region(s) to avoid interfering with a side menu event listeners.
   *
   * Defaults to `undefined`.
   */
  sideMenu?: 'left' | 'right' | 'both';

  /**
   * Side menu threshold in pixels.
   *
   * Defaults to `50`.
   */
  sideMenuThreshold?: number;

  /**
   * Short swipe duration in milliseconds.
   *
   * Short swipe is when a user quickly swipes between tabs. If the swipe duration is less than or equal to this
   * configured value, then we assume that the user wants to switch tabs.
   * To disable this behaviour set this value to `0`.
   *
   * Defaults to `300`
   */
  shortSwipeDuration?: number;

  /**
   * Enable debug mode.
   * Defaults to `false`.
   */
  debug?: boolean;

  /**
   * Whether the container should look and avoid elements with avoid-super-tabs attribute
   */
  avoidElements?: boolean;
```
