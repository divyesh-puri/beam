#!/usr/bin/env node
import { runBeam } from "../launcher.js";

void runBeam().catch((error) => {
  const message =
    error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
});
