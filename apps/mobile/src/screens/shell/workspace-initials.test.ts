import { describe, expect, it } from "vitest";
import { workspaceInitials } from "./workspace-initials";

describe("workspaceInitials", () => {
  it("takes the first letter of the first two words", () => {
    expect(workspaceInitials("Sawyer's Mac")).toBe("SM");
    expect(workspaceInitials("bee.connect.beam.invalid")).toBe("BC");
    expect(workspaceInitials("work-laptop")).toBe("WL");
  });
  it("takes two letters of a single word", () => {
    expect(workspaceInitials("Studio")).toBe("ST");
    expect(workspaceInitials("x")).toBe("X");
  });
  it("falls back to Beam for empty or punctuation-only labels", () => {
    expect(workspaceInitials(null)).toBe("BE");
    expect(workspaceInitials("   ")).toBe("BE");
    expect(workspaceInitials("--")).toBe("BE");
  });
  it("skips punctuation inside words", () => {
    expect(workspaceInitials("'quoted' (host)")).toBe("QH");
  });
});
