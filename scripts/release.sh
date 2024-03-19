set -e

# Replace version in all `package.json`
sed -i -e "s/\"version\": \".*\"/\"version\": \"$1\"/" package.json packages/*/package.json
sed -i -e "s/\/raw\/@drarig29\/modular-cli\/v[0-9]\+\.[0-9]\+\.[0-9]\+/\/raw\/@drarig29\/modular-cli\/v$1/" src/plugins.json

git add .
git commit -m "$1" || true
git push

yarn workspaces list --json | jq -r '.location' | while read -r dir; do
  cd $(git rev-parse --show-toplevel)/$dir
  npm publish --access public || true
done

git checkout dist
git merge main

# Build dist files
yarn build

jq -r 'keys[]' src/plugins.json | while read -r plugin; do
  checksum=$(sha512sum packages/$plugin/dist/index.js | cut -d ' ' -f 1)
  jq ".[\"$plugin\"].checksum = \"$checksum\"" src/plugins.json > src/plugins.json.tmp
  mv src/plugins.json.tmp src/plugins.json
done

git add .
git commit -m "Commit dist files"
git tag @drarig29/modular-cli/v$1
git push
git push --tags

# Go back to main
git checkout main
