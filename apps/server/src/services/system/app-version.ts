import semver from "semver";
import { z } from "zod";
import type { SystemVersionResponse } from "@bb/server-contract";
import type { ServerLogger, ServerRuntimeConfig } from "../../types.js";

const BEAM_LATEST_URL =
  "https://github.com/divyesh-puri/beam/releases/download/beam-desktop-latest/desktop-version.json";
const BEAM_LATEST_TIMEOUT_MS = 5_000;
const BEAM_LATEST_CACHE_TTL_MS = 60 * 60 * 1000;
const BEAM_RELEASE_URL =
  "https://github.com/divyesh-puri/beam/releases/tag/beam-desktop-latest";

const beamLatestResponseSchema = z
  .object({
    version: z.string().min(1),
  })
  .passthrough();

export interface AppVersionService {
  getSystemVersion(
    args?: AppVersionGetSystemVersionArgs,
  ): Promise<SystemVersionResponse>;
}

interface AppVersionGetSystemVersionArgs {
  forceRefresh?: boolean;
}

interface CreateAppVersionServiceArgs {
  config: Pick<ServerRuntimeConfig, "appVersion" | "isDevelopment">;
  fetchImpl?: typeof fetch;
  logger: ServerLogger;
  cacheTtlMs?: number;
  now?: () => number;
}

interface BeamLatestCacheEntry {
  cachedAt: number;
  latestVersion: string;
}

export function createAppVersionService(
  args: CreateAppVersionServiceArgs,
): AppVersionService {
  const fetchImpl = args.fetchImpl ?? fetch;
  const cacheTtlMs = args.cacheTtlMs ?? BEAM_LATEST_CACHE_TTL_MS;
  const now = args.now ?? (() => Date.now());
  const logger = args.logger;
  const config = args.config;

  let cache: BeamLatestCacheEntry | null = null;
  let inflight: Promise<string | null> | null = null;

  async function fetchBeamLatest(): Promise<string | null> {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(
      () => controller.abort(),
      BEAM_LATEST_TIMEOUT_MS,
    );
    try {
      const response = await fetchImpl(BEAM_LATEST_URL, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) {
        logger.warn(
          { status: response.status, url: BEAM_LATEST_URL },
          "Failed to fetch latest Beam version from GitHub",
        );
        return null;
      }
      const json = await response.json();
      const parsed = beamLatestResponseSchema.safeParse(json);
      if (!parsed.success) {
        logger.warn(
          { url: BEAM_LATEST_URL, issue: parsed.error.message },
          "Beam release response did not match expected shape",
        );
        return null;
      }
      return parsed.data.version;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.warn(
        { url: BEAM_LATEST_URL, error: message },
        "Beam release lookup failed",
      );
      return null;
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  async function getLatestVersion(args?: {
    forceRefresh?: boolean;
  }): Promise<string | null> {
    const currentTime = now();
    if (
      args?.forceRefresh !== true &&
      cache !== null &&
      currentTime - cache.cachedAt < cacheTtlMs
    ) {
      return cache.latestVersion;
    }
    if (inflight !== null) {
      return inflight;
    }
    const requestPromise = (async () => {
      const result = await fetchBeamLatest();
      if (result !== null) {
        cache = { cachedAt: now(), latestVersion: result };
      }
      return result;
    })();
    inflight = requestPromise;
    try {
      return await requestPromise;
    } finally {
      if (inflight === requestPromise) {
        inflight = null;
      }
    }
  }

  return {
    async getSystemVersion(
      args: AppVersionGetSystemVersionArgs = {},
    ): Promise<SystemVersionResponse> {
      const baseResponse: SystemVersionResponse = {
        currentVersion: config.appVersion,
        latestVersion: null,
        source: "github",
        updateAvailable: false,
        isDevelopment: config.isDevelopment,
        releaseUrl: BEAM_RELEASE_URL,
      };

      if (config.isDevelopment) {
        return baseResponse;
      }

      const latestVersion = await getLatestVersion({
        forceRefresh: args.forceRefresh,
      });
      if (latestVersion === null) {
        return baseResponse;
      }

      const parsedCurrent = semver.parse(config.appVersion);
      const parsedLatest = semver.parse(latestVersion);
      if (parsedCurrent === null || parsedLatest === null) {
        logger.warn(
          {
            currentVersion: config.appVersion,
            latestVersion,
          },
          "Skipping update check because a version is not valid semver",
        );
        return { ...baseResponse, latestVersion };
      }

      return {
        ...baseResponse,
        latestVersion,
        updateAvailable: semver.gt(parsedLatest, parsedCurrent),
      };
    },
  };
}
