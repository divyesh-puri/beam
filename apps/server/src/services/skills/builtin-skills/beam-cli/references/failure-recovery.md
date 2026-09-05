# Failure and interruption recovery

## Failures And Interruptions

- For failed threads, inspect `beam thread show <id> --json` and
  `beam thread log <id>` before deciding whether to retry, clarify, or update the
  user.
- For interrupted or stopped threads, inspect first. If the user stopped the
  thread, treat that as intentional unless they ask you to continue.
- Use `beam thread stop <id>` when a thread is stuck or no longer needed.
- `beam thread stop <id>` also releases an idle or stuck agent runtime. The
  command is idempotent and preserves thread history.
- Use `beam thread compact <id>` to send the built-in `/compact` command to an idle or errored thread. Completion or failure appears in the timeline. Codex, Claude Code, Pi, and OpenCode ACP support it; Cursor ACP does not expose compatible compaction through ACP.
- Use `beam thread cancel-plan <id>` to exit an active Plan turn without
  optimistically clearing its banner. Use `beam thread clear-goal <id>` to clear
  a Codex thread's durable active Goal. Both wait for provider confirmation.
