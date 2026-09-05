---
kind: instruction
title: Beam Guide — Environments
summary: Command reference for environment setup, inspection, commits, and merges.
intent: Provide complete environment command documentation for agents.
editingNotes: Keep flags accurate against the CLI implementation.
---
Environment commands

Environments determine where threads run. Multiple threads can share an environment
(e.g., a coding thread and a review thread in the same worktree).

Making your repo work with Beam:

  Commit a .bb-env-setup.sh script at the repo root when new Beam worktrees need
  repo-specific setup. After Beam creates a new managed worktree environment, it
  looks for .bb-env-setup.sh inside that new workspace. If the file is absent,
  provisioning continues with no error.

  The script must be tracked by git. A fresh worktree only checks out tracked
  files, so an untracked .bb-env-setup.sh in your source checkout will not be
  present and will not run.

  Beam runs the hook as `env bash .bb-env-setup.sh` with cwd set to the new
  workspace. POSIX shell setup scripts are not supported on Windows. The hook
  inherits the host daemon's sanitized environment: NODE_ENV and every BB_*
  variable are removed, and Beam does not inject BB_PROJECT_ID, BB_ENVIRONMENT_ID,
  or BB_SOURCE_PATH.

  The hook runs only for newly-created managed worktree environments. It does
  not run for direct/project-checkout environments, personal scratch workspaces,
  or reconnecting an existing managed worktree.

  A non-zero exit, timeout, signal, or cancellation fails provisioning and Beam
  removes the new worktree. Keep optional setup steps non-fatal inside the
  script if the environment should still open. Provisioning progress reports
  "Running .bb-env-setup.sh" and then ".bb-env-setup.sh finished",
  ".bb-env-setup.sh failed", or ".bb-env-setup.sh cancelled".

  Commit a .bb-env-teardown.sh script at the repo root when setup creates
  resources outside the managed worktree. Beam runs the hook as
  `env bash .bb-env-teardown.sh` from the worktree before it removes the
  worktree. The hook receives the same sanitized environment as the setup
  hook, and stdin is closed.

  Teardown has a separate 15-minute timeout. A non-zero exit, timeout, or
  signal reports failure in the destroy transcript, but Beam removes the
  worktree regardless. The teardown hook runs only when Beam destroys managed
  worktrees. It does not run for unmanaged or personal environments.

  New worktrees do not contain untracked files such as .env.local. To copy
  them from the source checkout, commit a .worktreeinclude file at the repo
  root. It uses gitignore syntax: one pattern per line, # for comments, ! to
  negate an earlier pattern. Beam copies each untracked file in the source
  checkout that matches a pattern:

    .env
    .env.*
    !.env.example
    certs/

  beam copies files only. It follows no symlinks, and it replaces nothing that
  the worktree already has. The copy runs after `git worktree add` and before
  .bb-env-setup.sh, so the setup script can read the copied files. A pattern
  that matches nothing, or a file Beam cannot read, is reported in the
  provisioning transcript and does not fail provisioning.

  Large directories such as node_modules are copied file by file. Install
  dependencies in .bb-env-setup.sh instead of listing them here.

  For files that customize agent instructions and skills (AGENTS.md,
  .bb/AGENTS.md, .bb/skills/), run `beam guide agent-configuration`.

  beam environment show <id>                Show environment details (path, branch, status)

  beam environment status <id>              Show workspace status
    --merge-base-branch <branch>          Include merge-base status

  beam environment branches <id>            List local and remote branches
    --query <query>                       Filter branch names
    --limit <count>                       Limit local and remote results

  beam environment paths <id>               Search workspace paths
    --query <query>                       Fuzzy path query
    --limit <count>                       Maximum results
    --files                               Include only files unless combined with --directories
    --directories                         Include only directories unless combined with --files

  beam environment diff <id>                Show file summary and full git diff
  beam environment diff-files <id>          List changed-file metadata
    --target <target>                     uncommitted, branch_committed, all, or commit (required)
    --merge-base-branch <branch>          Required for branch_committed and all
    --sha <sha>                           Required for commit

  beam environment diff-file <id>           Read one side of a changed file
    --target <target>                     Diff target (required)
    --path <path>                         Repository-relative path (required)
    --side <old|new>                      File side (required)
    --merge-base-ref <sha>                Required for branch_committed and all
    --sha <sha>                           Required for commit

  beam environment diff-patch <id>          Fetch selected file patches
    --target <target>                     Diff target (required)
    --path <path>                         Changed path; repeat for multiple files (required)
    --merge-base-branch <branch>          Required for branch_committed and all
    --sha <sha>                           Required for commit

  beam environment update <id>              Update environment metadata
    --merge-base-branch <branch>          Set merge-base branch override
    --clear-merge-base-branch             Clear merge-base override
    --name <name>                         Set display name
    --clear-name                          Clear display name

  beam environment commit <id>              Create a commit in the environment

  beam environment squash-merge <id>        Squash-merge into a target branch
    --merge-base-branch <branch>          Target branch (required)

  beam environment archive-threads <id>     Archive all threads in an environment

  When the last thread of a managed worktree environment is archived or
  deleted, Beam destroys the environment: it stops the agent process, then
  stops every process whose working directory is inside the worktree
  (background jobs the agent left behind, and also shells, editors, or
  servers you started there yourself), then removes the worktree and its
  branch. Each process gets SIGTERM, then SIGKILL after a short grace
  period. Move your own shells out of the worktree first if you want to
  keep them.

  beam environment pull-request show <id>   Inspect a pull request
  beam environment pull-request ready <id>  Mark a pull request ready
  beam environment pull-request draft <id>  Convert a pull request to draft
  beam environment pull-request merge <id>  Merge a pull request
    --method <method>                     merge, squash, or rebase

Every inspection command accepts an arbitrary environment ID and supports
`--json`. Non-git status/diff responses are reported explicitly. `diff-file`
prints UTF-8 content directly and labels base64 binary content; diff and patch
truncation markers are preserved.

Remote access (Beam Connect):

  Beam ships without a production Connect domain. After an operator provisions
  a Beam-owned Connect service, claim a handle in its dashboard, copy the
  command it generates, then run it here to pair:

  beam connect --code <code> --server https://<handle>.<connect-domain>
    --code <code>          One-time pairing code from the dashboard
    --server <url>         Explicit server URL from the dashboard

  Pairing returns immediately: the Beam SERVER redeems the code, stores the
  credential, and holds the tunnel itself — so it stays up as long as Beam is
  running and reconnects on restart (no foreground process).

  In a source checkout, `pnpm dev` automatically points the unpaired Connect
  settings and code-only pairing at that worktree's local Cloud origin through
  `BB_DEV_CONNECT_BASE_URL`. Explicit `--server` and `--base-url` targets still
  win, so the dev Beam can pair with a provisioned Connect deployment.

  beam connect status                       Show the server's connect status
  beam connect off                          Disconnect and forget the pairing
  beam connect expose <port> [--host <name-or-id>]    Share a host's HTTP port
  beam connect unexpose <port> [--host <name-or-id>]  Stop sharing on that host
  beam connect shares [--host <name-or-id>]           List that host's shares
  beam connect servers                      List every Beam on this account (handle, url, live)
  beam connect machine-code                 Mint a one-time code that pairs the Beam mobile app
                                          (needs the mobileApp experiment)

  Port sharing works from threads on any enrolled host. In a thread,
  `beam connect expose <port>` resolves the thread environment's host; outside a
  thread it defaults to the server host. `--host <name-or-id>` overrides that
  choice for expose, unexpose, and shares. Server-host URLs use
  `https://<server-label>--<port>.<connect-domain>`; machine-host URLs use
  `https://<machine-label>--<port>.<connect-domain>` and proxy directly through
  that machine's daemon. Access is owner-session-gated — only viewers signed into
  the owner's Beam Connect account can open the URL; it is not a public internet
  link. Agents should run expose from the thread that started the server, share
  the returned URL, and unexpose from the same thread when it stops.
  `beam connect status` shows all shares with host + URL. `shares --json` returns
  the resolved `host` and rows with `hostId`, `hostName`, `port`, and `url`.

  The Beam mobile app pairs with a paired Beam through Beam Connect. Turn on the
  `mobileApp` experiment first (`beam settings experiment mobileApp true`, or
  Settings → Experiments → Mobile app); the surfaces below stay hidden without
  it. Settings → Remote access → Add mobile device shows a QR code plus the code as text;
  `beam connect machine-code` prints the same code, server URL, apex, and expiry
  (`--json` for `{code, serverUrl, apex, expiresAt}`). The phone scans or
  types the code and enrolls as a connect machine on the account with its own
  revocable credential (it appears in the Beam Connect dashboard machine list).
  Codes last 10 minutes and work once; an account-machine-limit failure says
  so and points at the dashboard to revoke an unused device.

  Remote access is owned by the builtin "connect" plugin (Plugins → connect
  shows the URL, QR code, mobile pairing, and shared ports). Disabling the
  plugin (`beam plugin disable connect`) cuts off all remote access; re-enable
  with `beam plugin enable connect`.
