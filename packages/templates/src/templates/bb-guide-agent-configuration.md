---
kind: instruction
title: Beam Guide — Agent Configuration
summary: User and workspace files that customize agent instructions and skills.
intent: Document the user and workspace files that shape agent behavior for threads.
editingNotes: Keep accurate against the server's agent-instructions reader and skill loader.
---
Agent configuration

Beam reads agent configuration from the app data dir and from a project's .bb/
directory. These files shape how agents behave in provider-backed threads.

User instructions (<dataDir>/AGENTS.md):

  Add an AGENTS.md file to the Beam data dir (usually ~/.beam/AGENTS.md) to give
  every provider-backed thread across all projects default user-level
  instructions. Beam reads <dataDir>/AGENTS.md and appends its contents to the
  thread system prompt for all providers when a provider session starts.

Workspace instructions (.bb/AGENTS.md):

  Add a .bb/AGENTS.md file to a workspace to give every thread that runs there
  repo-specific instructions. Beam reads <workspace>/.bb/AGENTS.md and appends its
  contents to the thread system prompt for all providers, after any
  <dataDir>/AGENTS.md instructions, when a provider session starts. Track it with
  git so fresh managed worktrees include it.

  Only the plural AGENTS.md is read, only from the exact data-dir and
  workspace-root .bb/ locations above (Beam does not walk parent directories), and
  an empty file is ignored. This is Beam's own provider-agnostic instruction
  injection, separate from provider-native files such as CLAUDE.md or a
  repo-root AGENTS.md.

Skills (.bb/skills/):

  A skill is a reusable instruction file that Beam injects into a thread and
  exposes to the agent as a slash command. Place project skills under
  .bb/skills/<name>/SKILL.md in a workspace. Each SKILL.md has YAML frontmatter
  with `name` (lowercase, hyphenated, matching the directory) and `description`,
  followed by the instruction body.

  beam resolves skills from three sources, in increasing precedence:

    builtin    Skills bundled with Beam.
    user       <dataDir>/skills (e.g. ~/.beam/skills).
    project    <workspace>/.bb/skills.

  A project skill overrides a user or builtin skill with the same name. Two
  skills with the same name within one source collide and are both dropped.

  Use `beam skill list` to inspect installed and discovered skills and copy the
  opaque skill ID. `beam skill show|files <skill-id>` reads that exact skill;
  `beam skill show <skill-id> --json` returns the revision required by `beam skill
  update <skill-id> --revision <sha256>`. `beam skill delete <skill-id>` and
  update are restricted to editable, user-owned skills. These workspace-scoped
  commands default to `BB_PROJECT_ID`, then the personal project; pass
  `--project` or `--environment` when a different workspace is required.

  Use `beam skill search` to browse skills.sh, `beam skill registry detail
  <registry-skill-id>` to inspect metadata and the bounded file preview, and
  `beam skill install <registry-skill-id>` to install that canonical registry
  identity into Beam user skills. Registry commands are server-wide and do not
  accept workspace selectors.

  Use `beam skill install-cli-skills` to copy Beam's built-in agent skills, including the visible Browser skill, into a
  machine's global agent skill roots (`~/.agents/skills` and
  `~/.claude/skills`) so agents running outside Beam can drive it. It installs on
  every connected machine unless you pass `--machine <id-or-name>`, which is
  repeatable. Settings → Skills exposes the same action; it asks which machines
  only when more than one is enrolled. Machines install independently, so the
  command reports each machine's outcome and exits non-zero if any failed. The
  install replaces a previously installed copy of the same skill and leaves
  other skills alone. `beam skill cli-skills-status` reports whether each machine
  is installed, out of date, missing, or unknown (disconnected or unreachable);
  the settings row shows the same as a badge.

  Use the skill-creator skill to author and iterate on skills.
