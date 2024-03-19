const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");
const debug = require("debug")("cli");
const PLUGINS = require("./plugins.json");

const { createRequire } = require("node:module"); // Required for SEA.

const requirePlugin = createRequire(__filename);

const [command] = process.argv.slice(2);

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
    const pluginUrl = PLUGINS[`plugin-${command}`].url;

    const localFileName = `/tmp/${tag}/plugin-${command}.js`;

    if (fs.existsSync(localFileName)) {
      debug(`Found existing downloaded plugin`);
      const { execute } = await import(localFileName);
      debug(`Executing downloaded plugin ${command}...`);
      execute();
      return;
    }

    // TODO: use checksum to verify plugin integrity after download
    // TODO: always verify the checksum before running the plugin from a well-known location (`/tmp` or portable path)
    // TODO: for Node.js SEA, the checksums can be baked into the executable - but outside of that, we need to fetch the checksum from a trusted source, e.g. GitHub
    // TODO: make sure this isn't be vulnerable to something like https://github.com/vercel/pkg/security/advisories/GHSA-22r3-9w55-cj54
    // Note: using SHA512 as it's more secure. And no need for GPG as GitHub is on HTTPS.

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
