import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "../../..");
const workspaceGroups = ["packages", "apps", "tests", "plugins"];

async function directWorkspacePackageJsonPaths(): Promise<string[]> {
  const paths = [resolve(repositoryRoot, "package.json")];
  for (const group of workspaceGroups) {
    const entries = await readdir(resolve(repositoryRoot, group), {
      withFileTypes: true,
    });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        paths.push(resolve(repositoryRoot, group, entry.name, "package.json"));
      }
    }
  }

  const exampleEntries = await readdir(
    resolve(repositoryRoot, "examples/plugins"),
    { withFileTypes: true },
  );
  for (const entry of exampleEntries) {
    if (entry.isDirectory()) {
      paths.push(
        resolve(repositoryRoot, "examples/plugins", entry.name, "package.json"),
      );
    }
  }
  return paths;
}

describe("package publication safety", () => {
  it("keeps every workspace package private in the Beam fork", async () => {
    for (const packageJsonPath of await directWorkspacePackageJsonPaths()) {
      const manifest = JSON.parse(await readFile(packageJsonPath, "utf8"));
      expect(manifest, packageJsonPath).toMatchObject({ private: true });
    }
  });
});
