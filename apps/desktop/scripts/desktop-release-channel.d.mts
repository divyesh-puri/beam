export type DesktopReleaseChannel = "latest" | "nightly";
export type DesktopBuildPlatform = "macos" | "linux";

export interface DesktopUpdateMetadataFileNames {
  linux: "latest-linux.yml" | "nightly-linux.yml";
  macos: "latest-mac.yml" | "nightly-mac.yml";
}

export interface DesktopReleaseConfig {
  appId: "com.divyeshpuri.beam" | "com.divyeshpuri.beam.nightly";
  applicationName: "Beam" | "Beam Nightly";
  artifactName: string;
  iconFileName: "icon.png" | "icon-nightly.png";
  linuxExecutableName: "beam" | "beam-nightly";
  macIconPath: "assets/icon.icns" | "assets/icon-nightly.icns";
  releaseTag: "beam-desktop-latest" | "beam-desktop-nightly";
  updateMetadataFileNames: DesktopUpdateMetadataFileNames;
}

export function resolveDesktopReleaseChannel(
  env: NodeJS.ProcessEnv,
): DesktopReleaseChannel;

export function resolveDesktopBuildPlatform(
  nodePlatform: string,
): DesktopBuildPlatform;

export function createDesktopReleaseConfig(
  channel: DesktopReleaseChannel,
): DesktopReleaseConfig;

export function createDesktopUpdateReleaseBaseUrl(
  releaseTag: DesktopReleaseConfig["releaseTag"],
): string;
