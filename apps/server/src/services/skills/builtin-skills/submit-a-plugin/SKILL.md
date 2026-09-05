---
name: submit-a-plugin
description: Submit a Beam plugin to the Beam Community marketplace. Use whenever a user asks to submit, list, publish, or add a plugin to the Beam marketplace, or asks for a marketplace pull request. This skill validates the plugin and release, updates the Beam-owned marketplace manifest, and opens the pull request.
---

# Submit a plugin

Submit a public plugin to the Beam Community marketplace. The marketplace stores
plugin metadata. The plugin code stays in its Git repository or npm package.

## Choose the task

If the user asks only for instructions, explain the process without remote
changes.

If the user asks for a submission, prepare and validate everything possible.
Ask only for information that the plugin, Git, npm, GitHub, or marketplace
cannot supply.

A submission request does not approve a release. Before the first Git push, tag,
npm publication, or other release mutation, show the exact account, repository,
commit, package, version, source, and commands. Get approval for that release.

Do not expose credentials, private URLs, or local secrets. Never submit to the
upstream BB marketplace.

## Read current contracts

Read these files from the default branch of
https://github.com/divyesh-puri/beam:

- AGENTS.md
- apps/server/src/services/plugin-catalog/beam-community-marketplace.json
- apps/web/public/schemas/marketplace.schema.json
- apps/server/src/services/skills/builtin-skills/submit-a-plugin/references/marketplace-entry.md

Treat those files as the contract. Use this skill for workflow and quality
rules.

## Workflow

1. Read repository instructions, package.json, Git state, and release state.
2. Validate the plugin with its package manager and `beam plugin build`.
3. Select and verify one public release source.
4. Get separate approval before any release mutation.
5. Add one marketplace entry and, when needed, a vendored icon.
6. Validate the Beam repository's marketplace tests and formatting.
7. Commit only the marketplace entry, icon, and required generated output.
8. Open a pull request to `divyesh-puri/beam` from the submitter account.

Read these references as the task reaches each stage:

- Read references/plugin-release.md before validating or releasing a plugin.
- Read references/marketplace-entry.md before creating the entry or icon.
- Read references/pull-request.md before cloning, validating, or submitting
  the Beam repository.

Use scripts/derive-plugin-id.mjs to calculate the same plugin ID that Beam uses:

```sh
node /PATH/TO/THIS/SKILL/scripts/derive-plugin-id.mjs /PATH/TO/PLUGIN/package.json
```

## Completion

Return the pull request URL, released source, and validation results. Do not wait
for a merge unless the user asks.

A compatible release within an existing tracking range usually needs no new
marketplace pull request. Open another pull request when source, branding,
description, ownership, tag, or range changes.
