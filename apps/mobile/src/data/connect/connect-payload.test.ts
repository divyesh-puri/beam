import { describe, expect, it } from "vitest";
import {
  parseConnectPairingPayload,
  resolveEnrollmentTarget,
} from "./connect-payload";

describe("parseConnectPairingPayload", () => {
  it("reads the web/CLI JSON payload, normalizing the code and validating URLs", () => {
    expect(
      parseConnectPairingPayload(
        JSON.stringify({
          code: " abcd-efgh ",
          serverUrl: "https://bee.connect.beam.invalid/",
          apex: "https://connect.beam.invalid",
          expiresAt: "2026-08-19T10:00:00Z",
        }),
      ),
    ).toEqual({
      code: "ABCD-EFGH",
      serverUrl: "https://bee.connect.beam.invalid",
      apexUrl: "https://connect.beam.invalid",
      expiresAt: Date.UTC(2026, 7, 19, 10),
    });
    expect(
      parseConnectPairingPayload(
        '{"code":"ABCD-EFGH","serverUrl":"not a url","expiresAt":1700000000000}',
      ),
    ).toEqual({
      code: "ABCD-EFGH",
      serverUrl: null,
      apexUrl: null,
      expiresAt: 1700000000000,
    });
    expect(parseConnectPairingPayload('{"serverUrl":"https://x.y"}')).toBe(
      null,
    );
    expect(parseConnectPairingPayload("{not json")).toBe(null);
  });

  it("reads a pairing URL and a bare code; rejects arbitrary QR contents", () => {
    expect(
      parseConnectPairingPayload(
        "beam://connect?code=abcd-efgh&serverUrl=https%3A%2F%2Fbee.connect.beam.invalid",
      ),
    ).toEqual({
      code: "ABCD-EFGH",
      serverUrl: "https://bee.connect.beam.invalid",
      apexUrl: null,
      expiresAt: null,
    });
    expect(parseConnectPairingPayload("  abcd-efgh\n")).toEqual({
      code: "ABCD-EFGH",
      serverUrl: null,
      apexUrl: null,
      expiresAt: null,
    });
    expect(parseConnectPairingPayload("https://example.com/menu")).toBe(null);
    expect(parseConnectPairingPayload("hello world")).toBe(null);
    expect(parseConnectPairingPayload("")).toBe(null);
  });
});

describe("resolveEnrollmentTarget", () => {
  it("derives the apex from a server URL or uses an explicit override", () => {
    expect(
      resolveEnrollmentTarget({
        code: "ABCD-EFGH",
        server: "https://stub.localhost:42998/",
        apexUrl: "",
      }),
    ).toEqual({
      ok: true,
      code: "ABCD-EFGH",
      apexUrl: "https://localhost:42998",
      serverUrl: "https://stub.localhost:42998",
    });
    expect(
      resolveEnrollmentTarget({
        code: "ABCD-EFGH",
        server: "bee",
        apexUrl: "https://connect.example.com",
      }),
    ).toEqual({
      ok: true,
      code: "ABCD-EFGH",
      apexUrl: "https://connect.example.com",
      serverUrl: "https://bee.connect.example.com",
    });
    expect(
      resolveEnrollmentTarget({ code: "ABCD-EFGH", server: "", apexUrl: "" }),
    ).toEqual({
      ok: false,
      field: "apexUrl",
      message: "Enter your Beam Connect service URL.",
    });
  });

  it("fails closed for a handle without a Connect apex", () => {
    expect(
      resolveEnrollmentTarget({
        code: "ABCD-EFGH",
        server: "bee",
        apexUrl: "",
      }),
    ).toEqual({
      ok: false,
      field: "apexUrl",
      message: "Enter your Beam Connect service URL.",
    });
  });

  it("reports the offending field", () => {
    expect(
      resolveEnrollmentTarget({ code: "  ", server: "bee", apexUrl: "" }),
    ).toMatchObject({ ok: false, field: "code" });
    expect(
      resolveEnrollmentTarget({ code: "ab", server: "bee", apexUrl: "" }),
    ).toMatchObject({ ok: false, field: "code" });
    expect(
      resolveEnrollmentTarget({
        code: "ABCD-EFGH",
        server: "bee server",
        apexUrl: "",
      }),
    ).toMatchObject({ ok: false, field: "server" });
    expect(
      resolveEnrollmentTarget({
        code: "ABCD-EFGH",
        server: "ftp://bee",
        apexUrl: "",
      }),
    ).toMatchObject({ ok: false, field: "server" });
    expect(
      resolveEnrollmentTarget({
        code: "ABCD-EFGH",
        server: "bee",
        apexUrl: "connect.beam.invalid",
      }),
    ).toMatchObject({ ok: false, field: "apexUrl" });
  });
});
