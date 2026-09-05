import { describe, expect, it } from "vitest";
import { installSessionCookie, sessionCookieSpec } from "./cookie-store";

const session = {
  cookie: {
    name: "__Secure-bb-connect.desktop_session",
    value: "abc.def",
    domain: ".connect.beam.invalid",
    expiresAt: Date.UTC(2026, 7, 18, 11),
  },
};

describe("sessionCookieSpec", () => {
  it("marks the cookie Secure only for https servers", () => {
    expect(
      sessionCookieSpec(session, "https://bee.connect.beam.invalid"),
    ).toEqual({
      name: "__Secure-bb-connect.desktop_session",
      value: "abc.def",
      domain: ".connect.beam.invalid",
      path: "/",
      secure: true,
      httpOnly: true,
      expires: "2026-08-18T11:00:00.000Z",
    });
    expect(
      sessionCookieSpec(
        { cookie: { ...session.cookie, domain: "127.0.0.1" } },
        "http://127.0.0.1:42998",
      ),
    ).toMatchObject({ secure: false, domain: "127.0.0.1" });
  });

  it("rejects a cookie domain the server host does not domain-match", () => {
    const rogue = "https://bee.connect.beam.invalid.evil.example";
    for (const domain of [
      "bee.connect.beam.invalid",
      ".connect.beam.invalid",
      "connect.beam.invalid",
    ]) {
      expect(() =>
        sessionCookieSpec({ cookie: { ...session.cookie, domain } }, rogue),
      ).toThrow(
        /does not match bee\.connect\.beam\.invalid\.evil\.example/u,
      );
    }
    expect(() =>
      sessionCookieSpec(
        { cookie: { ...session.cookie, domain: "ant.connect.beam.invalid" } },
        "https://bee.connect.beam.invalid",
      ),
    ).toThrow(/does not match/u);
    expect(() =>
      sessionCookieSpec(
        { cookie: { ...session.cookie, domain: "ee.connect.beam.invalid" } },
        "https://bee.connect.beam.invalid",
      ),
    ).toThrow(/does not match/u);
  });

  it("accepts the host itself and any parent domain", () => {
    for (const domain of [
      "bee.connect.beam.invalid",
      ".bee.connect.beam.invalid",
      ".connect.beam.invalid",
      "connect.beam.invalid",
      "Connect.Beam.Invalid",
    ]) {
      expect(
        sessionCookieSpec(
          { cookie: { ...session.cookie, domain } },
          "https://bee.connect.beam.invalid",
        ),
      ).toMatchObject({ domain });
    }
  });

  it("installs into the shared jar and the WebKit store", async () => {
    const calls: { url: string; secure: boolean; useWebKit: boolean }[] = [];
    await installSessionCookie(
      {
        set: async (url, cookie, useWebKit) => {
          calls.push({ url, secure: cookie.secure, useWebKit });
        },
      },
      "https://bee.connect.beam.invalid",
      session,
    );
    expect(calls).toEqual([
      {
        url: "https://bee.connect.beam.invalid",
        secure: true,
        useWebKit: false,
      },
      {
        url: "https://bee.connect.beam.invalid",
        secure: true,
        useWebKit: true,
      },
    ]);
  });
});
