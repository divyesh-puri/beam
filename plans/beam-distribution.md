# Beam Standalone Distribution

## Outcome

This fork ships as Beam without broad internal package or protocol renames. A
packaged Beam installation can run beside upstream BB, defaults to `~/.beam`, and
updates only from `divyesh-puri/beam`. Development remains isolated by checkout
through the existing hashed development instance mechanism.

## Boundaries And Assumptions

- Keep internal `@bb/*`, `BB_*`, `.bb/` workspace-file, database-file, wire,
  and SDK names where they are compatibility or upstream-sync contracts.
- Keep `BB_DATA_DIR` as the explicit override. Its production default becomes
  `~/.beam`; no migration or fallback reads from `~/.bb` are allowed.
- Ambient `BB_DATA_DIR`, `BB_SERVER_PORT`, `BB_HOST_DAEMON_PORT`, and
  `BB_SERVER_URL` remain explicit compatibility overrides and can defeat
  side-by-side isolation when inherited from an upstream BB environment.
- Keep `bb` as a compatibility CLI alias while making `beam` the primary
  packaged entrypoint and displayed CLI name.
- Use separate production loopback ports, release tags, bundle IDs, executable
  names, Electron user-data, and single-instance identity so Beam and BB can
  run together.
- Signing, notarization, and publishing are release-operator actions and are
  not performed by this change.

## Acceptance Checks

1. **Identity source and assets**
   - Stable desktop config resolves to product name `Beam`, bundle ID
     `com.divyeshpuri.beam`, executable `beam`, and Beam icon assets generated
     reproducibly from a committed vector source and script.
   - Nightly identity is Beam-owned in configuration; no nightly artifact has
     been built or published by this work.
2. **Filesystem and runtime isolation**
   - Production config resolves data, config, logs, runtime locks, host daemon,
     and desktop-owned state under `~/.beam` by default.
   - Production Beam uses ports distinct from upstream BB.
   - Development data and ports remain derived from the absolute checkout.
   - Tests and package smoke use temporary homes/data directories and prove a
     sentinel under a temporary `~/.bb` remains unchanged.
3. **Update and release isolation**
   - Runtime and electron-builder updater URLs contain only
     `github.com/divyesh-puri/beam` and Beam-specific moving release tags.
   - The Beam desktop workflow names, tags, summaries, and artifact labels are
     Beam-specific. The retained upstream npm workflow is guarded so every job
     runs only in `get-bb/bb` and is impossible in this fork.
   - The machine installer accepts only the package served by its Beam server;
     missing or unreachable artifacts fail without PATH or npm fallback.
4. **CLI compatibility**
   - Packaged `beam --help` and `beam --version` succeed and identify Beam.
   - Packaged `bb --help` remains a low-cost compatibility alias to the same
     CLI and uses the same Beam data/runtime.
5. **Packaged macOS app**
   - `Beam.app` is produced locally and its `Info.plist` reports the exact
     product name, executable metadata, icon, version, and bundle ID.
   - A launch smoke starts the packaged app against isolated temporary data and
     Electron user-data, reaches the health/runtime checks, and shuts down only
     its owned processes.
   - The packaged browser automation Electron compatibility test and the
     `browserAutomation` experiment path pass.
6. **Quality and handoff**
   - Focused tests, affected Turbo typechecks/builds, `git diff --check`, and
     stale-source checks over production identity and updater paths pass.
   - Concise user/developer docs explain Beam installation, paths, CLI alias,
     attribution, release feed, and unsigned local-package limitations.
   - Final handoff reports the exact artifact path, verification evidence,
     signing/notarization/release risks, and clean/dirty status.

## Work Log

- 2026-09-02: Created focused plan before edits. Initial trace found the
  production data default in `@bb/config`, duplicated desktop data fallback,
  shared production ports, Electron release-channel identity, runtime updater
  feed, desktop workflows, and packaged CLI bins as primary contracts.
- 2026-09-02: Implemented the Beam desktop, updater, CLI, production-path,
  remote-service, workflow, documentation, and attribution identity while
  retaining internal BB contracts. Added a reproducible Beam SVG-to-PNG/ICNS
  generator and hermetic packaged-app smoke coverage.
- 2026-09-02: Produced
  `apps/desktop/release/mac-arm64/Beam.app`. Its plist reports Beam,
  `com.divyeshpuri.beam`, executable `Beam`, version `0.40.0`, and `icon.icns`;
  strict codesign verification passes with an ad-hoc local signature.
- 2026-09-02: Packaged launch smoke passed without a `--user-data-dir` flag,
  proving packaged Electron desktop state resolves below the explicit Beam data
  root. The same smoke passed `beam --help`, `beam --version`, the `bb` alias,
  and an unchanged temporary upstream `~/.bb` sentinel.
- 2026-09-02: Initial focused test runs passed for desktop, config, scripts,
  bb-app runtime, server browser automation, and CLI branding. The later
  tarball SDK declaration check exposed an unrelated baseline missing
  `browser` member in `packages/bb-app/src/public-sdk.ts`; that parity change is
  deliberately outside this identity patch.
- 2026-09-02: Two icon generations on this macOS checkout were byte-for-byte
  stable. Cross-platform byte determinism is not claimed. Updater stale-source
  searches and `git diff --check` passed, and no release, PR, push, signing
  credential, notarization credential, or real `~/.bb` operation was used.
- 2026-09-02: Reduced the identity patch after review: restored the upstream npm
  workflow and broad UI, story, demo, mobile, web, plugin SDK, template,
  provider-tooling, and release-runbook churn. Beam's desktop workflow and both
  runtime update checks now use only the fork's Beam-specific GitHub release
  tags; upstream `@bb` and npm publishing contracts remain intact.
- 2026-09-02: Diagnosed the intermittent packaged smoke timeout with a live
  process sample. A synthetic test `HOME` caused Electron `safeStorage` to block
  in macOS Keychain authorization before the renderer loaded. The macOS smoke
  now uses Chromium's test-only mock keychain switch; real app launches are
  unchanged. Three consecutive hermetic launches passed using the default
  temporary `~/.beam` while preserving a temporary `~/.bb` sentinel.
- 2026-09-02: Rebuilt and reverified the reduced patch. The fresh Beam bundle,
  default-path smoke, CLI entrypoints, focused runtime tests, update-feed tests,
  and Electron browser automation pass. Strict code-sign verification passes
  with an ad-hoc signature; Apple signing, Gatekeeper distribution assessment,
  notarization, and release publication remain release-operator work. The
  unrelated baseline `bb-app` public SDK browser-area type mismatch remains
  intentionally outside this identity patch.
- 2026-09-02: Graduation fixes made the machine installer fail closed for 404,
  network failure, and hostile PATH cases; guarded every retained upstream
  publish job to `get-bb/bb`; made Beam the primary local-build documentation;
  replaced the macOS-only update command with an HTTPS release URL usable by
  Linux clients; and added generated `CFBundleExecutable` verification. The
  macOS `Beam.app` is artifact-tested. Linux identity remains configuration-
  and browser-acceptance-tested only; no Linux package was produced locally.
- 2026-09-02: Corrected the update API contract so the Beam release URL is a
  URL-validated `releaseUrl`, not an executable `upgradeCommand`. The CLI labels
  it as a release link and the web settings action opens it externally; focused
  server, CLI, web settings, and affected-package typechecks pass.
