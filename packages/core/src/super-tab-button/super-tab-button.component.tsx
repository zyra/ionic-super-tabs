import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'super-tab-button',
  styleUrl: 'super-tab-button.component.scss',
  shadow: true,
})
export class SuperTabButtonComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabButtonElement;
  @State() active: boolean;
  @Prop() index: number;
  @Prop() disabled: boolean;

  /**
   * Emitted when the button has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

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

  @Listen('focus')
  onFocus() {
    this.ionFocus.emit();
  }

  @Listen('blur')
  onBlur() {
    this.ionBlur.emit();
  }

  hostData() {
    const label: HTMLIonLabelElement = this.el.querySelector('ion-label');

    return {
      role: 'button',
      'aria-label': label ? label.innerText : undefined,
      'aria-disabled': this.disabled ? 'true' : undefined,
      class: {
        'ion-activatable': true,
        'ion-focusable': true,
      },
    };
  }

  render() {
    console.log('im alive!');
    return [
      <slot></slot>,
      <ion-ripple-effect type="unbounded"></ion-ripple-effect>
    ];
  }
}
