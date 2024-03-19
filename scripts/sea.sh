# Bundle into a single file
npx esbuild --platform=node --bundle src/cli.js --minify --outdir=dist

# Generate blob
node --experimental-sea-config sea-config.json

# Copy Node.js executable
if command -v volta &> /dev/null; then
  echo "Copying Node.js executable from volta"
  cp $(volta which node) ./modular-cli
else
  echo "Copying Node.js executable from system"
  cp $(command -v node) ./modular-cli
fi

if [[ $(uname) == "Darwin" ]]; then
  # Inject blob into executable (with `--macho-segment-name` option)
  npx postject ./modular-cli NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA

  # Sign the executable
  codesign --sign - ./modular-cli
else
  # Inject blob into executable
  npx postject ./modular-cli NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
fi
