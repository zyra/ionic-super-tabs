import { Component, ComponentInterface, Element, h, Host, Prop, State } from '@stencil/core';


@Component({
  tag: 'super-tab-button',
  styleUrl: 'super-tab-button.component.scss',
  shadow: true,
})
export class SuperTabButtonComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabButtonElement;

  /** @internal */
  @Prop({ reflectToAttr: true }) active?: boolean;

  /** @internal */
  @Prop({ reflectToAttr: true }) index?: number;

  /**
   * Whether the button is disabled
   */
  @Prop({ reflectToAttr: true }) disabled?: boolean;

  /** @internal */
  @Prop() scrollableContainer: boolean = false;

  @State() label!: HTMLElement | null;
  @State() icon!: HTMLElement | null;

  indexChildren() {
    this.label = this.el.querySelector('ion-label');
    this.icon = this.el.querySelector('ion-icon');
  }

  componentWillLoad() {
    this.indexChildren();
  }

  componentDidUpdate() {
    this.indexChildren();
  }

  componentDidLoad() {
    const slot = this.el!.shadowRoot!.querySelector('slot');
    slot!.addEventListener('slotchange', () => {
      this.indexChildren();
    });
  }

  render() {
    return (
      <Host
        role="button"
        aria-label={this.label ? this.label.innerText : false}
        aria-disabled={this.disabled ? 'true' : false}
        aria-selected={this.active ? 'true' : 'false'}
        class={{
          'ion-activatable': true,
          'ion-focusable': true,
          'icon-only': !!this.icon && !this.label,
          'label-only': !!this.label && !this.icon,
          active: Boolean(this.active),
          scrollableContainer: this.scrollableContainer,
        }}>
        <slot/>
        <ion-ripple-effect type="unbounded"/>
      </Host>
    );
  }
}
