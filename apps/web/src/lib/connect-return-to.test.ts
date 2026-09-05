import { describe, expect, it } from "vitest";

import { connectReturnTo } from "./connect-return-to";

describe("connect return-to URLs", () => {
  it("accepts immediate connect subdomains for the current app domain", () => {
    expect(
      connectReturnTo(
        "https://sawyer.connect.beam.invalid/projects?tab=threads",
        "https://connect.beam.invalid",
      ),
    ).toBe("https://sawyer.connect.beam.invalid/projects?tab=threads");
  });

  it("accepts staging connect subdomains", () => {
    expect(
      connectReturnTo(
        "https://sawyer.vibecodethis.site/",
        "https://vibecodethis.site",
      ),
    ).toBe("https://sawyer.vibecodethis.site/");
  });

  it("accepts local Cloud handles under the shared cookie domain", () => {
    expect(
      connectReturnTo(
        "http://sawyer.beam.localhost:42745/threads/thr_1",
        "http://beam.localhost:42745",
      ),
    ).toBe("http://sawyer.beam.localhost:42745/threads/thr_1");
  });

  it("rejects nested subdomains and off-domain return targets", () => {
    expect(
      connectReturnTo(
        "https://a.b.connect.beam.invalid/",
        "https://connect.beam.invalid",
      ),
    ).toBeNull();
    expect(
      connectReturnTo("https://evil.test/", "https://connect.beam.invalid"),
    ).toBeNull();
  });

  it("rejects protocol downgrades", () => {
    expect(
      connectReturnTo(
        "http://sawyer.connect.beam.invalid/",
        "https://connect.beam.invalid",
      ),
    ).toBeNull();
  });

  it("treats absent and the literal 'null'/'undefined' strings as no return target", () => {
    expect(connectReturnTo(null, "https://connect.beam.invalid")).toBeNull();
    expect(
      connectReturnTo(undefined, "https://connect.beam.invalid"),
    ).toBeNull();
    expect(connectReturnTo("", "https://connect.beam.invalid")).toBeNull();
    expect(connectReturnTo("null", "https://connect.beam.invalid")).toBeNull();
    expect(
      connectReturnTo("undefined", "https://connect.beam.invalid"),
    ).toBeNull();
  });
});
