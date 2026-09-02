import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testDir, "..", "..", "..");

it("limits concurrent Turbo test tasks to the CI runner CPU count", () => {
  const workflow = readFileSync(
    resolve(repoRoot, ".github", "workflows", "ci.yml"),
    "utf8",
  );
  const testStep = /- name: Test\n\s+run: ([^\n]+)/u.exec(workflow)?.[1];

  expect(testStep).toContain("--concurrency=4");
});

it("keeps the upstream package publishing workflow disabled in forks", () => {
  const workflow = readFileSync(
    resolve(repoRoot, ".github", "workflows", "publish-bb-app.yml"),
    "utf8",
  );
  const jobNames = [
    "publish",
    "publish-nightly",
    "publish-plugin-sdk",
    "nightly-desktop-macos",
    "nightly-desktop-linux",
    "nightly-mobile-ios",
    "nightly-desktop-publish",
  ];

  for (const [index, jobName] of jobNames.entries()) {
    const start = workflow.indexOf(`\n  ${jobName}:`);
    const nextJob =
      index === jobNames.length - 1
        ? workflow.length
        : workflow.indexOf(`\n  ${jobNames[index + 1]}:`, start + 1);
    expect(start).toBeGreaterThan(-1);
    expect(workflow.slice(start, nextJob)).toContain(
      "github.repository == 'get-bb/bb'",
    );
  }
});
