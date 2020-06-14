import { Component, ComponentInterface, Element, h, Host, Method, Prop } from '@stencil/core';


@Component({
  tag: 'super-tab',
  styleUrl: 'super-tab.component.scss',
  shadow: true,
  scoped: false,
})
export class SuperTabComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabElement;

  /**
   * Set this to true to prevent vertical scrolling of this tab. Defaults to `false`.
   *
   * This property will automatically be set to true if there is
   * a direct child element of `ion-content`. To override this
   * behaviour make sure to explicitly set this property to `false`.
   */
  @Prop({
    reflect: true,
  }) noScroll!: boolean;

  @Prop() loaded: boolean = false;
  @Prop() visible: boolean = false;

  componentDidLoad() {
    this.checkIonContent();
  }

  componentDidUpdate() {
    // check for ion-content after update, in case it was dynamically loaded
    this.checkIonContent();
  }

  /**
   * Check if we have an ion-content as a child and update the `noScroll` property
   * if it's not set yet.
   */
  private checkIonContent() {
    if (typeof this.noScroll !== 'boolean') {
      const ionContentEl = this.el.querySelector('ion-content');

      if (ionContentEl && ionContentEl.parentElement === this.el) {
        this.noScroll = true;
      }
    }
  }

  /**
   * Returns the root scrollable element
   */
  @Method()
  async getRootScrollableEl(): Promise<HTMLElement | null> {
    if (!this.noScroll && this.el.scrollHeight > this.el.clientHeight) {
      return this.el;
    }

    const ionContent: any = this.el.querySelector('ion-content');

    if (ionContent) {
      return ionContent.getScrollElement();
    }

    if (this.noScroll) {
      return null;
    }

    return this.el;
  }

  render() {
    return <Host style={{ visibility: this.visible ? 'visible' : 'hidden' }}>
      {
        this.loaded ? <slot></slot> : null
      }
    </Host>;
  }
}
