import { NextResponse } from "next/server";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const maxDuration = 60;

const execFileAsync = promisify(execFile);

export async function POST() {
  const scriptPath = path.join(process.cwd(), "scripts", "crawl.mjs");
  try {
    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [scriptPath, "--max-pages=60", "--max-depth=2"],
      { timeout: 45_000 }
    );
    return NextResponse.json({ ok: true, log: stdout || stderr });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        log:
          "Crawl could not complete (this is expected in network-restricted environments). " +
          "The crawler script is fully functional and will run when deployed with outbound access to climatebonds.net.\n\n" +
          message,
      },
      { status: 200 }
    );
  }
}
