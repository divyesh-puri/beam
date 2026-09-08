# Configuration and skill management

## Environment Setup And Teardown Scripts

- To make a repo work with Beam worktrees, run `beam guide environments`. It
  documents the repo-level `.bb-env-setup.sh` and `.bb-env-teardown.sh` hooks,
  and the `.worktreeinclude` file.
- A new worktree checks out tracked files only. Commit a `.worktreeinclude`
  file at the repo root to list untracked files, such as `.env`, that Beam must
  copy from the source checkout. It uses gitignore pattern syntax. Beam copies
  the matches before it runs `.bb-env-setup.sh`.

## App settings

- Read `references/app-settings.md` for every general key, experiment, default,
  and effect.
- Use `beam settings show` and `beam settings ai-services` for current values.
- Use `beam settings general <key> <value>` or
  `beam settings experiment <key> <value>` for updates.
- Use `beam settings keyboard list`, `set`, and `reset` for shortcut overrides.
- Use `beam settings usage [--machine <id-or-name>]` for provider limits.
  `--host` is an alias for `--machine`.
- Use `beam settings version [--force]` for release information.
- Use `beam settings reload` to reload Beam-managed configuration.
- These commands support `--json`.

## Agent Instructions

- Add `AGENTS.md` to the Beam data dir (usually `~/.beam/AGENTS.md`) to inject
  user-level default instructions for every provider-backed thread across all
  projects.
- Add `.bb/AGENTS.md` at a workspace root to inject repo-specific instructions
  into every thread that runs there. Track the workspace file with git so fresh
  managed worktrees include it.
- Beam appends data-dir instructions first, then workspace instructions, to the
  thread system prompt for all providers when a provider session starts.
- Only the plural `AGENTS.md` is read, only from those exact locations (no
  parent-directory walk); an empty file is ignored. Run
  `beam guide agent-configuration` for details (it also covers project
  `.bb/skills/`).

## Skills

- Use `beam skill list` to inspect installed and discovered skills. It defaults to
  `BB_PROJECT_ID`, then the personal project; pass `--project` or
  `--environment` to select another workspace.
- Copy the opaque ID from `beam skill list`, then use `beam skill show <skill-id>`
  or `beam skill files <skill-id>` to read that exact skill.
- `beam skill show <skill-id> --json` returns the revision. Pass that revision,
  plus `--file`, to `beam skill update <skill-id>`. Use update or delete only when
  the list says editable.
- Use `beam skill search [query]` for live skills.sh results. With no query it
  lists what is trending. The page defaults to zero, and the page size defaults
  to 24. The `ranking` field names the selected leaderboard.
- In JSON, `installs` is the ranking-window count. `lifetimeInstalls` is the
  resolved lifetime count or `null`. Resolution covers at most 48 rows and can
  fail at any page size. Human output prints `—` for an unresolved lifetime
  count.
- Inspect metadata and the bounded file preview with
  `beam skill registry detail <registry-skill-id>`.
  Install with `beam skill install <registry-skill-id>`; never infer an install
  source from a display name.
- `beam skill install-cli-skills` copies Beam's built-in agent skills, including the visible Browser skill, into a machine's
  global agent skill roots (`~/.agents/skills` and `~/.claude/skills`) so agents
  outside Beam can drive it. It targets every connected machine unless you pass
  the repeatable `--machine <id-or-name>`, and reports each machine's outcome.
  Settings → Skills has the same action; it confirms first, and asks which
  machines only when more than one is enrolled.
- `beam skill cli-skills-status` reports per machine whether the installed copy is
  `installed`, `outdated`, `missing`, or `unknown` (disconnected or unreachable).
