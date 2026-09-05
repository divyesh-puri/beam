# CLI, Guide, And Skill

Keep the discoverable surfaces in sync whenever you add or change a `beam` CLI command, flag, or a user-facing configuration knob (env var, `.bb/` workspace file, settings field):

- Update the in-CLI guide templates under `packages/templates/src/templates/bb-guide-*.md`; Turbo regenerates `packages/templates/src/generated/templates.generated.ts` (not committed) before every build, typecheck, and test task.
- Update the beam-cli skill at `apps/server/src/services/skills/builtin-skills/beam-cli/SKILL.md`. Configuration knobs also belong in `docs/configuration.md`.
- Match the existing chapter/section style; keep entries concise and accurate against the implementation.
