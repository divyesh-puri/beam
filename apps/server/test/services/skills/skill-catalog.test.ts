import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { setExperiments } from "@bb/db";
import { defaultExperiments } from "@bb/domain";
import { afterEach, describe, expect, it } from "vitest";
import { resolveSkillCatalog } from "../../../src/services/skills/skill-catalog.js";
import {
  createTestAppHarness,
  type TestAppHarness,
} from "../../helpers/test-app.js";

let harness: TestAppHarness | null = null;

afterEach(async () => {
  await harness?.cleanup();
  harness = null;
});

describe("resolveSkillCatalog", () => {
  it("injects the built-in beam-browser skill only while browser automation is enabled", async () => {
    harness = await createTestAppHarness();
    const skillRoot = join(
      harness.config.builtinSkillsRootPath,
      "beam-browser",
    );
    await mkdir(skillRoot, { recursive: true });
    await writeFile(
      join(skillRoot, "SKILL.md"),
      "---\nname: beam-browser\ndescription: Control the visible Browser.\n---\n",
    );

    expect(
      resolveSkillCatalog(harness.deps).some(
        (entry) => entry.runtimeSource.name === "beam-browser",
      ),
    ).toBe(false);

    setExperiments(harness.db, {
      ...defaultExperiments,
      browserAutomation: true,
    });
    expect(
      resolveSkillCatalog(harness.deps).some(
        (entry) =>
          entry.provenance.kind === "builtin" &&
          entry.runtimeSource.name === "beam-browser",
      ),
    ).toBe(true);
  });
});
