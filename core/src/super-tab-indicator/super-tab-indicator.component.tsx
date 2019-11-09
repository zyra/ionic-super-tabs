import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';


@Component({
  tag: 'super-tab-indicator',
  styleUrl: 'super-tab-indicator.component.scss',
  shadow: true,
})
export class SuperTabIndicatorComponent implements ComponentInterface {

  /**
   * Toolbar position
   * This determines the position of the indicator
   */
  @Prop() toolbarPosition: 'top' | 'bottom' = 'top';

  render() {
    const style: any = {};

    if (this.toolbarPosition === 'bottom') {
      style.top = 0;
    } else {
      style.bottom = 0;
    }

    return (
      <Host style={style}/>
    );
  }
}
