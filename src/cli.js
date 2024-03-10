const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

const [command] = process.argv.slice(2);

// Example for Yarn: https://github.com/yarnpkg/berry/raw/master/packages/plugin-workspace-tools/bin/%40yarnpkg/plugin-workspace-tools.js

const PLUGIN_BASE_URL = `https://github.com/Drarig29/modular-cli/raw/{tag}/packages/plugin-{name}/dist/index.js`;
const BASE_TAG = `@drarig29/modular-cli/v{version}`;
const VERSION = "0.0.1";

async function main() {
  if (!command) {
    console.log("No command provided");
    process.exit(1);
  }

  try {
    const { execute } = await import(`@drarig29/modular-cli.plugin-${command}`);
    execute();
  } catch {
    const tag = BASE_TAG.replace("{version}", VERSION);
    const pluginUrl = PLUGIN_BASE_URL.replace("{tag}", tag).replace(
      "{name}",
      command
    );

    const localFileName = `/tmp/${tag}/plugin-${command}.js`;

    if (fs.existsSync(localFileName)) {
      console.log(`Executing plugin ${command}...`);
      const { execute } = await import(localFileName);
      execute();
      return;
    }

    console.log(`Fetching plugin from ${pluginUrl}`);

    const response = await fetch(pluginUrl);
    if (response.status !== 200) {
      console.error("Plugin not found");
      return;
    }

    const content = await response.text();

    console.log(`Saving plugin to ${localFileName}`);

    await fsp.mkdir(path.dirname(localFileName), { recursive: true });
    await fsp.writeFile(localFileName, content);

    console.log(`Executing plugin ${command}...`);
    const { execute } = await import(localFileName);
    execute();
  }
}

main();
