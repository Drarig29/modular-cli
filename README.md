# modular-cli

- The core of the CLI should be minimal.
<!--
XXX: not sure about this actually.
- Nothing else than commands should be exported from each plugin.
- Anything exported from `modular-cli` should be directly available, not through plugins. A plugin should never be installed and imported as a library (e.g. `import {someUtil} from '@drarig29/modular-cli.plugin-heavy'`) -->

Running `modular-cli <command> <anything>` requires a plugin named `@drarig29/modular-cli.plugin-<command>`

Supported ways to use it:
- With Node.js
  - [x] `npm i -g @drarig29/modular-cli <command>` (installed globally)
    - Downloads the required plugin, and saves it for future executions.
    - Note: Can be run with `modular-cli <command>`
    - Note: Doesn't load plugins installed **globally** with `npm i -g @drarig29/modular-cli.plugin-<command>`
  - [x] `npx @drarig29/modular-cli <command>` (not installed, run from any non-project folder)
    - Downloads the required plugin, and saves it for future executions.
    - Note: Doesn't load plugins installed **globally** with `npm i -g @drarig29/modular-cli.plugin-<command>`
  - [x] `npx @drarig29/modular-cli <command>` (not installed, run from a project)
    - Downloads the required plugin, and saves it for future executions.
    - Note: Doesn't load plugins installed **locally** with `npm i -g @drarig29/modular-cli.plugin-<command>`
  - [x] `npx @drarig29/modular-cli <command>` (run from a project where it's installed)
    - Loads the required plugin if it's installed **locally** with `npm i @drarig29/modular-cli.plugin-<command>`
    - Otherwise, downloads the required plugin, and saves it for future executions.
  - [ ] `npx @drarig29/modular-cli plugins import [<name> ...]` (run from a project where it's installed)
    - This will save all requested plugins locally into a `.modular-cli/plugins` folder, you should commit this folder.
    - `npx @drarig29/modular-cli <command>` will load the required plugin from that folder.
    - Note: Installing the plugins in such a way results in a smaller installation footprint as the plugins are minimized.
    - Note: Running the command without any plugin name will detect a configuration file, and guess the plugins to install.
- Without Node.js
  - [x] A standalone executable (roughly the size of Node.js itself) must be downloaded with `curl`
    - Downloads the required plugin, and saves it for future executions.

Note: `.modular-cli` is called a portable path.

References:
- https://github.com/yarnpkg/berry/blob/daa574791b3b2df01e76c1fdfd9c975050a0fb9d/packages/yarnpkg-builder/sources/commands/build/plugin.ts
- https://github.com/yarnpkg/berry/blob/daa574791b3b2df01e76c1fdfd9c975050a0fb9d/packages/yarnpkg-builder/sources/commands/new/plugin.ts#L6
- https://github.com/yarnpkg/berry/blob/daa574791b3b2df01e76c1fdfd9c975050a0fb9d/packages/plugin-essentials/sources/commands/plugin/list.ts#L6
- https://raw.githubusercontent.com/yarnpkg/berry/master/plugins.yml
- https://github.com/yarnpkg/berry/blob/daa574791b3b2df01e76c1fdfd9c975050a0fb9d/packages/plugin-essentials/sources/commands/plugin/import.ts#L123
- https://github.com/yarnpkg/berry/blob/master/packages/docusaurus/docs/advanced/04-technical/plugin-tutorial.mdx
- https://github.com/yarnpkg/berry/blob/daa574791b3b2df01e76c1fdfd9c975050a0fb9d/packages/yarnpkg-cli/sources/tools/getDynamicLibs.ts#L19-L22
- https://github.com/yarnpkg/berry/blob/daa574791b3b2df01e76c1fdfd9c975050a0fb9d/packages/yarnpkg-core/sources/Configuration.ts#L1110-L1379
- https://github.com/yarnpkg/berry/issues/1678#issuecomment-669873299
