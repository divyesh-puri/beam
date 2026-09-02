import { copyFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const packageRoot = resolve(import.meta.dirname, "..");
const sourcePath = resolve(packageRoot, "assets", "beam-icon.svg");
const iconPath = resolve(packageRoot, "assets", "icon.png");
const temporaryRoot = await mkdtemp(join(tmpdir(), "beam-icon-"));
const iconsetPath = join(temporaryRoot, "Beam.iconset");
await mkdir(iconsetPath);

const iconsetSizes = [
  [16, "icon_16x16.png"],
  [32, "icon_16x16@2x.png"],
  [32, "icon_32x32.png"],
  [64, "icon_32x32@2x.png"],
  [128, "icon_128x128.png"],
  [256, "icon_128x128@2x.png"],
  [256, "icon_256x256.png"],
  [512, "icon_256x256@2x.png"],
  [512, "icon_512x512.png"],
  [1024, "icon_512x512@2x.png"],
];

try {
  await sharp(sourcePath).resize(1024, 1024).png().toFile(iconPath);
  await Promise.all(
    iconsetSizes.map(([size, fileName]) =>
      sharp(sourcePath)
        .resize(size, size)
        .png()
        .toFile(join(iconsetPath, fileName)),
    ),
  );

  const iconutil = spawnSync(
    "iconutil",
    [
      "--convert",
      "icns",
      "--output",
      resolve(packageRoot, "assets", "icon.icns"),
      iconsetPath,
    ],
    { stdio: "inherit" },
  );
  if (iconutil.status !== 0) {
    throw new Error("iconutil failed to generate the Beam macOS icon");
  }

  await Promise.all([
    copyFile(iconPath, resolve(packageRoot, "assets", "icon-dev.png")),
    copyFile(iconPath, resolve(packageRoot, "assets", "icon-nightly.png")),
    copyFile(
      resolve(packageRoot, "assets", "icon.icns"),
      resolve(packageRoot, "assets", "icon-nightly.icns"),
    ),
  ]);
} finally {
  await rm(temporaryRoot, { force: true, recursive: true });
}
