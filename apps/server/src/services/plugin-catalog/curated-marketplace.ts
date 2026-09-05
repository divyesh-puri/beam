import bundledMarketplace from "./beam-community-marketplace.json" with { type: "json" };
import {
  CURATED_MARKETPLACE_NAME,
  parseMarketplaceManifestJson,
} from "./marketplace-manifest.js";

export const BUNDLED_CURATED_MARKETPLACE = parseMarketplaceManifestJson(
  JSON.stringify(bundledMarketplace),
  "bundled Beam Community marketplace",
);

if (BUNDLED_CURATED_MARKETPLACE.name !== CURATED_MARKETPLACE_NAME) {
  throw new Error(
    `bundled marketplace name must be ${CURATED_MARKETPLACE_NAME}`,
  );
}
