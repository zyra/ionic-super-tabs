import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'super-tabs-toolbar',
  styleUrl: 'super-tabs-toolbar.component.scss',
  shadow: true,
})
export class SuperTabsToolbarComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsToolbarElement;
  @State() activeButton: boolean;
  @State() activeButtonIndex: boolean;
  @Prop() index: number;
  @Prop() toolbarPosition: 'top' | 'bottom' = 'top';

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  @Listen('click')
  async onClick(ev: MouseEvent) {
    console.log('This el is ', this.el, ev);
    // const ripple: HTMLIonRippleEffectElement = this.el.shadowRoot.querySelector('ion-ripple-effect');
    // await ripple.addRipple(ev.pageX, ev.pageY);
  }

  render() {
    return [
      this.toolbarPosition === 'top' && <slot />,
      <span class="indicator" />,
      this.toolbarPosition === 'bottom' && <slot />,
    ];
  }
}
