const [command] = process.argv.slice(2)

async function main() {
  if (!command) {
    console.log('No command provided')
    process.exit(1)
  }

  const { execute } = await import(`@drarig29/modular-cli.${command}`)
  execute()
}

main()
