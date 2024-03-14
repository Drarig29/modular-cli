const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const debug = require("debug")("cli");
const { createRequire } = require("node:module");

const requirePlugin = createRequire(__filename);

const [command] = process.argv.slice(2);

// Example for Yarn: https://github.com/yarnpkg/berry/raw/@yarnpkg/cli/3.4.1/packages/plugin-workspace-tools/bin/@yarnpkg/plugin-workspace-tools.js

const PLUGIN_BASE_URL = `https://github.com/Drarig29/modular-cli/raw/{tag}/packages/plugin-{name}/dist/index.js`;
const BASE_TAG = `@drarig29/modular-cli/v{version}`;
const VERSION = "0.0.5";

async function main() {
  if (!command) {
    console.log("No command provided");
    process.exit(1);
  }

  try {
    const { execute } = await import(`@drarig29/modular-cli.plugin-${command}`);
    debug("Executing installed plugin...");
    execute();
  } catch {
    const tag = BASE_TAG.replace("{version}", VERSION);
    const pluginUrl = PLUGIN_BASE_URL.replace("{tag}", tag).replace(
      "{name}",
      command
    );

    const localFileName = `/tmp/${tag}/plugin-${command}.js`;

    if (fs.existsSync(localFileName)) {
      debug(`Found existing downloaded plugin`);
      const { execute } = await import(localFileName);
      debug(`Executing downloaded plugin ${command}...`);
      execute();
      return;
    }

    debug(`Fetching plugin from ${pluginUrl}`);
    const response = await fetch(pluginUrl);
    if (response.status !== 200) {
      console.error(`Could not fetch plugin: ${response.status}`);
      return;
    }

    const content = await response.text();

    debug(`Saving plugin to ${localFileName}`);
    await fsp.mkdir(path.dirname(localFileName), { recursive: true });
    await fsp.writeFile(localFileName, content);

    debug(`Executing downloaded plugin ${command}...`);
    const { execute } = requirePlugin(localFileName);
    execute();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
