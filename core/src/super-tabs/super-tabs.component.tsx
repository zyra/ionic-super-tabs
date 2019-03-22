import { Component, ComponentInterface, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { DEFAULT_CONFIG, SuperTabsConfig } from '../super-tabs.model';

@Component({
  tag: 'super-tabs',
  styleUrl: 'super-tabs.component.scss',
  shadow: true,
})
export class SuperTabsComponent implements ComponentInterface {
  @Element() el!: HTMLSuperTabsElement;

  @State() active: boolean;

  @Prop() index: number;
  @Prop() config: SuperTabsConfig = DEFAULT_CONFIG;
  @Prop({ reflectToAttr: true, mutable: true, }) activeTabIndex: number = 0;

  /**
   * Emitted when the button loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  private container: HTMLSuperTabsContainerElement;
  private toolbar: HTMLSuperTabsToolbarElement;

  @Prop({ reflectToAttr: true, mutable: true }) hasToolbar: boolean;

  @Listen('click')
  async onClick(ev: MouseEvent) {
    console.log('This el is ', this.el, ev);
  }

  setSelectedTabIndex(index: number) {
    console.log('Container is ', this.container);
    if (this.container) {
      this.container.activeTabIndex = index;
    }

    console.log('Toolbar is ', this.toolbar);
    if (this.toolbar) {
      this.toolbar.setActiveTab(index);
    }
  }

  indexChildren() {
    this.container = this.el.querySelector('super-tabs-container');
    this.toolbar = this.el.querySelector('super-tabs-toolbar');
    this.hasToolbar = !!this.toolbar;

    if (this.container) {
      this.container.config = this.config;
    }

    if (this.toolbar) {
      this.toolbar.config = this.config;
    }
  }

  componentDidUpdate() {
    this.indexChildren();
    this.setSelectedTabIndex(this.activeTabIndex);
  }

  componentWillLoad() {
    this.indexChildren();
    this.setSelectedTabIndex(this.activeTabIndex);

    this.container.addEventListener('selectedTabIndexChange', (ev: any) => {
      if (this.toolbar) {
        this.toolbar.setSelectedTab(ev.detail);
      }
    });

    this.container.addEventListener('activeTabIndexChange', (ev: any) => {
      if (this.toolbar) {
        this.toolbar.setActiveTab(ev.detail);
      }
    });
  }

  render() {
    return [
      <slot/>,
    ];
  }
}
