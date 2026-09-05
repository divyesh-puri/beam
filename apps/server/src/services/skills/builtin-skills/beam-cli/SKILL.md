---
name: beam-cli
description: Use this when controlling Beam. The Beam CLI inspects and manages threads, environments, projects, machines, providers, skills, plugins, settings, terminals, and other Beam services.
---

# Beam CLI

Use `beam` for Beam state and actions. Inspect the current context before you choose
IDs, machines, workspaces, providers, or models.

## Start with context

```sh
beam status --json
```

Use JSON when command output controls later work. Use human output for quick
inspection.

Run `beam --version` for the CLI version. Use `beam --help` or `beam help [command]`
for help. Run `beam guide` for the system overview. Run `beam guide <chapter>` for one
area. Use `beam <group> --help` for current flags and defaults.

A standalone CLI targets http://127.0.0.1:48886. Use BB_SERVER_URL and
BB_HOST_DAEMON_PORT only for an intentional non-default target.

## Read only the relevant reference

- Read references/command-index.md to find the exact core command path. Use
  live help for current flags and defaults.
- Read references/configuration.md for settings, agent instructions, skills,
  remote clients, and environment setup scripts.
- Read references/thread-creation.md before you spawn or fork threads, create
  projects, select machines, or create environments.
- Read references/thread-operation.md for messages, queues, interactions,
  panes, terminals, inspection, and long-running commands.
- Read references/failure-recovery.md when a thread fails, stops, or needs plan
  or goal recovery.
- Read references/theme-commands.md for palette and favicon commands. Read
  references/theming.md before you create or edit theme CSS.
- Read references/plugins.md for plugin discovery, install, build, update,
  configuration, runtime, and contributed commands.
- Read references/app-settings.md for complete app setting keys and effects.
- Read the `beam-browser` skill before visible Browser QA or web interaction.

## Command habits

- Resolve names and IDs with a list or show command before mutation.
- Pass an explicit project when a command can act across projects.
- Pass an environment or machine selector when the default host is uncertain.
- Query provider models on the machine that will run the thread.
- Prefer non-interactive commands and machine-readable output for automation.
- Pass `--yes` for a confirmed destructive command in a non-interactive shell.
- Treat plugin commands as normal top-level commands after installation.
- Inspect real status, logs, API results, or diffs instead of assumptions.
- Keep file paths on the machine that owns the selected workspace.

## Common checks

```sh
beam project list --json
beam machine list --json
beam provider list --environment "$BB_ENVIRONMENT_ID" --json
beam thread show "$BB_THREAD_ID" --json
beam environment status "$BB_ENVIRONMENT_ID" --json
beam browser list --json
beam plugin list --json
beam skill list --environment "$BB_ENVIRONMENT_ID" --json
```

## Completion

Confirm the command result and any affected thread, environment, plugin, or
remote service. Report the stable ID or URL that the user needs next.
