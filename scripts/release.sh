set -e

# Replace version in all `package.json`
sed -i -e "s/\"version\": \".*\"/\"version\": \"$1\"/" package.json packages/*/package.json
sed -i -e "s/const VERSION = \".*\"/const VERSION = \"$1\"/" src/cli.js

git add .
git commit -m "$1"
git push

yarn workspaces list --json | jq -r '.location' | while read -r dir; do
  cd $(git rev-parse --show-toplevel)/$dir
  npm publish --access public
done

git checkout dist
git merge main

# Build dist files
yarn build
git add .
git commit -m "Commit dist files"
git tag @drarig29/modular-cli/v$1
git push
git push --tags

# Go back to main
git checkout main
