import { angularOutputTarget } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';


export const config: Config = {

  namespace: 'SuperTabs',
  bundles: [
    { components: ['super-tabs', 'super-tabs-container', 'super-tab'] },
    { components: ['super-tabs-toolbar', 'super-tab-button'] },
    { components: ['super-tab-indicator'] },
  ],
  plugins: [
    sass(),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [{ src: '**/*.scss' }],
    },
    {
      type: 'docs-readme',
      strict: true,
    },
    {
      type: 'dist-hydrate-script',
    },
    angularOutputTarget({
      componentCorePackage: '@ionic-super-tabs/core',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
      directivesUtilsFile: '../angular/src/directives/proxies-utils.ts',
      directivesArrayFile: '../angular/src/directives/proxies-list.txt',
      excludeComponents: [
        'super-tab-indicator',
      ],
    }),
    reactOutputTarget({
      componentCorePackage: '@ionic-super-tabs/core',
      proxiesFile: '../react/src/components.ts',
      excludeComponents: [
        'super-tab-indicator',
      ],
    }),
  ],
  validateTypes: true,
};
