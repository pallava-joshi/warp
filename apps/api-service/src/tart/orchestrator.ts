/**
 * Tart VM orchestrator: spawn OpenCode VM, wait for healthy, stop.
 * Requires: tart (brew install cirruslabs/cli/tart)
 */

import { spawn, exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const VM_NAME = process.env.TART_VM_NAME ?? "warp-opencode";
const OPENCODE_PORT = 4096;
const MAX_WAIT_MS = 120_000;
const POLL_INTERVAL_MS = 2_000;

let tartProcess: ReturnType<typeof spawn> | null = null;

/** Run tart CLI command, return stdout. */
async function tart(...args: string[]): Promise<string> {
  const { stdout } = await execAsync(`tart ${args.join(" ")}`, {
    encoding: "utf-8",
  });
  return stdout.trim();
}

/** Get VM IP if running, else null. */
export async function getVMIP(): Promise<string | null> {
  try {
    const ip = await tart("ip", VM_NAME);
    return ip && ip.length > 0 ? ip : null;
  } catch {
    return null;
  }
}

/** Check if opencode serve is healthy at baseUrl. */
async function isHealthy(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/global/health`);
    const data = (await res.json()) as { healthy?: boolean };
    return data?.healthy === true;
  } catch {
    return false;
  }
}

/** Spawn Tart VM, wait for OpenCode healthy, return baseUrl. */
export async function spawnVM(): Promise<string> {
  const ip = await getVMIP();
  if (ip) {
    const baseUrl = `http://${ip}:${OPENCODE_PORT}`;
    if (await isHealthy(baseUrl)) {
      return baseUrl;
    }
  }

  tartProcess = spawn("tart", ["run", VM_NAME], {
    stdio: "ignore",
    detached: true,
  });
  tartProcess.unref();

  const deadline = Date.now() + MAX_WAIT_MS;
  while (Date.now() < deadline) {
    const currentIp = await getVMIP();
    if (currentIp) {
      const baseUrl = `http://${currentIp}:${OPENCODE_PORT}`;
      if (await isHealthy(baseUrl)) {
        return baseUrl;
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  await stopVM();
  throw new Error("Timeout waiting for Tart VM and OpenCode to become healthy");
}

/** Stop the Tart VM. */
export async function stopVM(): Promise<void> {
  tartProcess = null;
  try {
    await tart("stop", VM_NAME);
  } catch {
    // Ignore if already stopped
  }
}

/** Get baseUrl for OpenCode in VM; spawn if not running. */
export async function getOrCreateVM(): Promise<string> {
  const ip = await getVMIP();
  if (ip) {
    const baseUrl = `http://${ip}:${OPENCODE_PORT}`;
    if (await isHealthy(baseUrl)) {
      return baseUrl;
    }
  }
  return spawnVM();
}
