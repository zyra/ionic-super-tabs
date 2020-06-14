import { Component, ComponentInterface, Element, h, Host, Prop, State } from '@stencil/core';


const maxRetryAttempts = 1e3;

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
  @Prop({ reflectToAttr: true }) disabled: boolean = false;

  /** @internal */
  @Prop() scrollableContainer: boolean = false;

  @State() label!: HTMLElement | null;
  @State() icon!: HTMLElement | null;

  private retryAttempts: number = 0;

  componentDidLoad() {
    this.indexChildren();
    this.initCmp();
  }

  private initCmp() {
    if (!this.el || !this.el.shadowRoot) {
      if (++this.retryAttempts < maxRetryAttempts) {
        requestAnimationFrame(() => this.initCmp());
        return;
      }
    }

    if (!this.label && !this.icon) {
      this.indexChildren();
    }

    const slot = this.el!.shadowRoot!.querySelector('slot');
    slot!.addEventListener('slotchange', () => {
      this.indexChildren();
    });
  }

  private indexChildren() {
    this.label = this.el.querySelector('ion-label');
    this.icon = this.el.querySelector('ion-icon');
  }

  render() {
    return (
      <Host
        role="button"
        aria-label={this.label ? this.label.innerText : false}
        aria-disabled={this.disabled ? 'true' : false}
        aria-selected={this.active ? 'true' : 'false'}
        class={{
          'ion-activatable': !this.disabled,
          'ion-focusable': !this.disabled,
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
