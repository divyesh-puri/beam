import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PI_BRIDGE_SESSION_DIR_ENV,
  resolvePiBridgeSessionDir,
} from "./session-paths.js";

describe("resolvePiBridgeSessionDir", () => {
  it("defaults to Beam's isolated data directory", () => {
    expect(resolvePiBridgeSessionDir({ env: {} })).toBe(
      join(homedir(), ".beam", "pi-bridge-sessions"),
    );
  });

  it("follows an explicit Beam data directory", () => {
    expect(
      resolvePiBridgeSessionDir({ env: { BB_DATA_DIR: "./custom-data" } }),
    ).toBe(join(resolve("./custom-data"), "pi-bridge-sessions"));
  });

  it("prefers the dedicated session directory override", () => {
    expect(
      resolvePiBridgeSessionDir({
        env: {
          BB_DATA_DIR: "./custom-data",
          [PI_BRIDGE_SESSION_DIR_ENV]: "./custom-sessions",
        },
      }),
    ).toBe(resolve("./custom-sessions"));
  });
});
