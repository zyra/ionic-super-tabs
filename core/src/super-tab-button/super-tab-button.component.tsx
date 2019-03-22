import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

@Component({
  tag: 'super-tab-button',
  styleUrl: 'super-tab-button.component.scss',
  shadow: true,
})
export class SuperTabButtonComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabButtonElement;

  @Prop() active?: boolean;
  @Prop() index?: number;
  @Prop() disabled?: boolean;

  hostData() {
    const label: any = this.el.querySelector('ion-label');

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
    return [
      <slot/>,
      <ion-ripple-effect type="unbounded"/>,
    ];
  }
}
