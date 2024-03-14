const { ciUtils } = require("@drarig29/modular-cli.core");

function execute() {
  console.log(
    `Executing command "bar" on commit ${ciUtils.getCiCommitSha()}...`
  );
}

module.exports = { execute };
