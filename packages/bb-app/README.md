<p align="center">
  <img alt="Beam" src="../../apps/desktop/assets/icon.png" width="128">
</p>

# Beam runtime

Beam is a standalone agent orchestrator that can control, customize, and
automate itself. Work runs in threads that you can follow live, steer at any
point, or hand off to another agent.

This fork retains the upstream `bb-app` package coordinate as an internal
compatibility contract. Beam is the product name and `beam` is the primary CLI;
`bb` remains an alias for existing scripts and plugins.

> The `bb-app` package currently published on npm is upstream BB, not Beam. Do
> not use `npx bb-app` to install Beam.

## Run Beam from this repository

From the repository root:

```bash
npm exec -- pnpm install --frozen-lockfile
npm exec -- pnpm --dir apps/desktop run package
open apps/desktop/release/mac-arm64/Beam.app
```

The packaged app keeps its state in `~/.beam`, listens on
`http://127.0.0.1:48886`, and runs its host daemon on port `48887`. These
defaults are separate from upstream BB, so both products can run at the same
time.

Explicit `BB_DATA_DIR`, `BB_SERVER_PORT`, `BB_HOST_DAEMON_PORT`, and
`BB_SERVER_URL` values are retained as compatibility overrides. Pointing them
at an upstream BB installation intentionally disables that isolation.

## CLI

Use the primary Beam command for scripts and agent instructions:

```bash
beam status
beam project list
beam thread list
beam guide
```

The `bb` executable invokes the same Beam CLI when it comes from this build. It
exists only for compatibility and is ambiguous when upstream BB is also on
`PATH`.

## SDK compatibility

The package still exports the upstream-compatible Node SDK surface:

```ts
import { BBSdk } from "bb-app";

const beam = new BBSdk();
const threads = await beam.threads.list();
console.log(threads);
```

The `BBSdk`, `@bb/*`, `@get-bb/plugin-sdk`, plugin manifest `bb` field,
`engines.bb`, `BB_*` environment variables, and workspace `.bb/` directory are
compatibility contracts. They do not change Beam's displayed product identity
or its isolated production defaults.

## Source and attribution

- [Beam repository](https://github.com/divyesh-puri/beam)
- [Configuration](https://github.com/divyesh-puri/beam/blob/main/docs/configuration.md)
- [Multiple devices](https://github.com/divyesh-puri/beam/blob/main/docs/multiple-devices.md)
- [Upstream attribution](../../NOTICE)
