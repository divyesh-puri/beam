import { describe, expect, it } from "vitest";
import {
  ANDROID_ASSET_LINKS_PATH,
  APPLE_APP_SITE_ASSOCIATION_PATH,
  BB_MOBILE_ANDROID_PACKAGE,
  handleAppLinkAssociationRequest,
  parseAssetLinksFingerprints,
} from "../src/app-links.js";

describe("app link association files", () => {
  it("serves the AASA only after a Beam Apple app id is provisioned", async () => {
    const request = {
      method: "GET",
      url: `https://sawyer.connect.beam.invalid${APPLE_APP_SITE_ASSOCIATION_PATH}`,
    };
    const unconfigured = handleAppLinkAssociationRequest(request, {});
    expect(unconfigured?.status).toBe(200);
    expect(unconfigured?.headers.get("content-type")).toBe("application/json");
    const unconfiguredBody = (await unconfigured?.json()) as {
      applinks: Record<string, unknown> & {
        details: Record<string, unknown>[];
      };
    };
    expect(unconfiguredBody.applinks.details).toEqual([]);

    const configured = handleAppLinkAssociationRequest(request, {
      APPLE_APP_ID: "TEAMID1234.com.divyeshpuri.beam.mobile",
    });
    const configuredBody = (await configured?.json()) as {
      applinks: Record<string, unknown> & {
        details: Record<string, unknown>[];
      };
    };
    expect(configuredBody.applinks.details).toEqual([
      {
        appIDs: ["TEAMID1234.com.divyeshpuri.beam.mobile"],
        components: [
          { "/": "/threads/*" },
          { "/": "/projects/*" },
          { "/": "/settings/*" },
        ],
      },
    ]);
    expect(Object.keys(configuredBody.applinks)).toEqual(["details"]);
  });

  it("declares the Android app only after signing fingerprints are provisioned", async () => {
    const unset = handleAppLinkAssociationRequest(
      {
        method: "GET",
        url: `https://connect.beam.invalid${ANDROID_ASSET_LINKS_PATH}`,
      },
      {},
    );
    expect(await unset?.json()).toEqual([]);

    const set = handleAppLinkAssociationRequest(
      {
        method: "GET",
        url: `https://connect.beam.invalid${ANDROID_ASSET_LINKS_PATH}`,
      },
      { ASSETLINKS_SHA256_FINGERPRINTS: "aa:bb:cc, dd:ee:ff\n11:22" },
    );
    const setBody = (await set?.json()) as {
      target: { package_name: string; sha256_cert_fingerprints: string[] };
    }[];
    expect(setBody[0]?.target.package_name).toBe(BB_MOBILE_ANDROID_PACKAGE);
    expect(setBody[0]?.target.sha256_cert_fingerprints).toEqual([
      "AA:BB:CC",
      "DD:EE:FF",
      "11:22",
    ]);
    expect(parseAssetLinksFingerprints(undefined)).toEqual([]);
  });

  it("ignores other paths and refuses non-GET methods", () => {
    expect(
      handleAppLinkAssociationRequest(
        {
          method: "GET",
          url: "https://connect.beam.invalid/.well-known/other",
        },
        {},
      ),
    ).toBeNull();
    expect(
      handleAppLinkAssociationRequest(
        { method: "GET", url: "https://connect.beam.invalid/threads/x" },
        {},
      ),
    ).toBeNull();
    const post = handleAppLinkAssociationRequest(
      {
        method: "POST",
        url: `https://connect.beam.invalid${APPLE_APP_SITE_ASSOCIATION_PATH}`,
      },
      {},
    );
    expect(post?.status).toBe(405);
    const head = handleAppLinkAssociationRequest(
      {
        method: "HEAD",
        url: `https://connect.beam.invalid${APPLE_APP_SITE_ASSOCIATION_PATH}`,
      },
      {},
    );
    expect(head?.status).toBe(200);
    expect(head?.body).toBeNull();
  });
});
