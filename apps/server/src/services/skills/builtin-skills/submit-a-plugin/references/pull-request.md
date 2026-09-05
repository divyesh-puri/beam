# Marketplace validation and pull request

Read this file before you clone, validate, or submit the Beam repository.

## Prepare a clean branch

Verify the GitHub account:

```sh
gh auth status
gh api user --jq .login
```

Create or reuse the submitter fork. Clone into a new directory:

```sh
gh repo fork divyesh-puri/beam --clone=false
git clone https://github.com/GITHUB_LOGIN/beam.git /SAFE/NEW/PATH/beam
cd /SAFE/NEW/PATH/beam
git remote add upstream https://github.com/divyesh-puri/beam.git
git fetch upstream main
git switch -c submit-PLUGIN_ID upstream/main
```

If upstream exists, verify its URL. Do not reuse a directory with unrelated
changes or overwrite an existing branch.

If `gh` is unavailable or authentication fails, continue with local preparation:

```sh
git clone https://github.com/divyesh-puri/beam.git /SAFE/NEW/PATH/beam
cd /SAFE/NEW/PATH/beam
git switch -c submit-PLUGIN_ID
```

Prepare and validate the entry and icon. Return their paths, the clone path,
branch name, and results. Give the user these remaining steps:

1. Fork `divyesh-puri/beam`.
2. Add the fork as a remote.
3. Push `submit-PLUGIN_ID`.
4. Open a pull request against `divyesh-puri/beam:main`.

Never open a submission against `get-bb/marketplace`.

## Validate the marketplace

Install repository dependencies without running submitted plugin code, then use
Beam's Turbo tasks:

```sh
pnpm install --ignore-scripts
pnpm exec turbo run test --filter=@bb/server --force
pnpm exec turbo run typecheck --filter=@bb/server
git status --short
git diff --check
git diff -- apps/server/src/services/plugin-catalog/beam-community-marketplace.json \
  apps/server/src/services/plugin-catalog/marketplace-icons/
```

Confirm:

- The entry ID matches the plugin manifest.
- The public source contains the selected release and reviewed code.
- The source subdirectory is correct.
- Entry engine ranges do not exceed manifest ranges.
- The author account matches the pull request account.
- The description states observed user value.
- The icon meets size, format, location, and reference rules.
- The server marketplace tests and typecheck pass.

## Open the pull request

Commit only the entry, icon, and required generated output. Do not commit `dist/`
or unrelated files.

```sh
git add apps/server/src/services/plugin-catalog/beam-community-marketplace.json
git add apps/server/src/services/plugin-catalog/marketplace-icons/PLUGIN_ICON
git commit -m "Add plugin entry: PLUGIN_ID"
git push -u origin submit-PLUGIN_ID
```

Open the pull request:

```sh
gh pr create \
  --repo divyesh-puri/beam \
  --base main \
  --head GITHUB_LOGIN:submit-PLUGIN_ID \
  --title "Add plugin entry: PLUGIN_ID" \
  --body-file /SAFE/PATH/pr-body.md
```

Use the validated plugin ID in shell arguments. Keep display text in data files.
Follow the Beam repository instructions. The pull request body must state:

- What the plugin does.
- The release source and selected range or ref.
- The plugin checks that passed.
- The Beam marketplace checks that passed.
- Required permissions, external services, and relevant security facts.
- `> AGENT GENERATED` as the final line when an agent creates the pull request.
