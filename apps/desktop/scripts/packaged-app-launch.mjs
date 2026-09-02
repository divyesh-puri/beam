export const LINUX_DISABLE_SANDBOX_ARGUMENT = "--no-sandbox";

export function createPackagedAppLaunchArguments({ platform, userDataDir }) {
  const sandboxArguments =
    platform === "linux" ? [LINUX_DISABLE_SANDBOX_ARGUMENT] : [];
  return userDataDir === null
    ? sandboxArguments
    : [...sandboxArguments, `--user-data-dir=${userDataDir}`];
}
