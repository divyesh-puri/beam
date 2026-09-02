export const LINUX_DISABLE_SANDBOX_ARGUMENT: "--no-sandbox";

export interface PackagedAppLaunchArgumentsArgs {
  platform: NodeJS.Platform;
  userDataDir: string | null;
}

export function createPackagedAppLaunchArguments(
  args: PackagedAppLaunchArgumentsArgs,
): string[];
