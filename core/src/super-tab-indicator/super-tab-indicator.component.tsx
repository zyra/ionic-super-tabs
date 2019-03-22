import { Component, ComponentInterface, Element, Watch, Prop, State } from '@stencil/core';

@Component({
  tag: 'super-tab-indicator',
  styleUrl: 'super-tab-indicator.component.scss',
  shadow: true,
  scoped: true,
})
export class SuperTabIndicatorComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsToolbarElement;

  @State() private activeButton: HTMLSuperTabButtonElement;
  @State() private _isDragging: boolean;

  @Prop() selectedTabIndex: number;
  @Prop({ reflectToAttr: true }) activeTabIndex: number;
  @Prop({ reflectToAttr: true }) isDragging: boolean;
  @Prop() toolbarPosition: 'top' | 'bottom' = 'top';

  @Watch('selectedTabIndex')
  onSelectedTabIndexChange(index: number) {
    console.log(this.activeButton, this._isDragging, index);
  }

  @Watch('isDragging')
  onIsDraggingChange(dragging: boolean) {
    this._isDragging = Boolean(dragging);
  }

  hostData() {
    const positionStyle: any = {};

    if (this.toolbarPosition === 'bottom') {
      positionStyle.top = 0;
    } else {
      positionStyle.bottom = 0;
    }

    return {
      style: {
        ...positionStyle,
      }
    }
  }

  render() {
    return (<span>&nbsp;</span>);
  }
}
