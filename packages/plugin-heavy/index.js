const client = require('@aws-sdk/client-s3')

function execute() {
  console.log('Executing command "heavy"...')
  console.log(`Loaded ${Object.values(client).length} members from @aws-sdk/client-s3`)
}

module.exports = {execute}
