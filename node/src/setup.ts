import * as fs from 'fs';
import * as path from 'path';

const EULA_MARKER_FILE = path.join(
  process.env.USERPROFILE || process.env.HOME || '.',
  '.workiq-eula-accepted'
);
const EULA_URL = 'https://github.com/microsoft/work-iq-mcp';

export interface PreflightResult {
  passed: boolean;
  checks: {
    name: string;
    passed: boolean;
    message: string;
  }[];
}

/**
 * Check if the WorkIQ EULA has been accepted (marker file exists).
 */
export function checkEulaAccepted(): boolean {
  return fs.existsSync(EULA_MARKER_FILE);
}

/**
 * Record EULA acceptance by writing a marker file.
 */
export function recordEulaAcceptance(): void {
  const dir = path.dirname(EULA_MARKER_FILE);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    EULA_MARKER_FILE,
    `Accepted on ${new Date().toISOString()} for ${EULA_URL}\n`,
    'utf-8'
  );
}

/**
 * Get the EULA URL for display purposes.
 */
export function getEulaUrl(): string {
  return EULA_URL;
}

/**
 * Run all preflight checks. Verifies WorkIQ EULA acceptance.
 * Authentication is handled by the WorkIQ CLI and M365 Copilot locally.
 */
export function runPreflight(_tenantId?: string): PreflightResult {
  const checks: PreflightResult['checks'] = [];

  // 1. WorkIQ EULA
  const eulaAccepted = checkEulaAccepted();
  checks.push({
    name: 'WorkIQ EULA',
    passed: eulaAccepted,
    message: eulaAccepted
      ? 'EULA accepted'
      : `EULA not yet accepted. Review and accept at: ${EULA_URL}\n` +
        `  Run with --setup to accept interactively, or create the marker file:\n` +
        `  echo "accepted" > "${EULA_MARKER_FILE}"`,
  });

  return {
    passed: checks.every((c) => c.passed),
    checks,
  };
}

/**
 * Print preflight results to stderr.
 */
export function printPreflightResults(result: PreflightResult): void {
  console.error('');
  console.error('╔══════════════════════════════════════════════╗');
  console.error('║  Preflight Checks                            ║');
  console.error('╚══════════════════════════════════════════════╝');
  console.error('');

  for (let i = 0; i < result.checks.length; i++) {
    const check = result.checks[i];
    const icon = check.passed ? '✅' : '❌';
    console.error(`  [${i + 1}/${result.checks.length}] ${check.name}... ${icon} ${check.message}`);
  }

  console.error('');

  if (!result.passed) {
    console.error('  One or more preflight checks failed. Fix the issues above and try again.');
    console.error('  Use --skip-preflight to bypass these checks.');
    console.error('');
  } else {
    console.error('  All preflight checks passed.');
    console.error('');
  }
}
