# Replace version in all `package.json`
sed -i -e "s/\"version\": \".*\"/\"version\": \"$1\"/" package.json packages/*/package.json

git add .
git commit -m "$1"

yarn workspaces list --json | jq -r '.location' | while read -r dir; do
  cd $(git rev-parse --show-toplevel)/$dir

  echo "publish"
done
