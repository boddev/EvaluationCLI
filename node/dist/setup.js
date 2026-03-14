"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEulaAccepted = checkEulaAccepted;
exports.recordEulaAcceptance = recordEulaAcceptance;
exports.getEulaUrl = getEulaUrl;
exports.runPreflight = runPreflight;
exports.printPreflightResults = printPreflightResults;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const EULA_MARKER_FILE = path.join(process.env.USERPROFILE || process.env.HOME || '.', '.workiq-eula-accepted');
const EULA_URL = 'https://github.com/microsoft/work-iq-mcp';
/**
 * Check if the WorkIQ EULA has been accepted (marker file exists).
 */
function checkEulaAccepted() {
    return fs.existsSync(EULA_MARKER_FILE);
}
/**
 * Record EULA acceptance by writing a marker file.
 */
function recordEulaAcceptance() {
    const dir = path.dirname(EULA_MARKER_FILE);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EULA_MARKER_FILE, `Accepted on ${new Date().toISOString()} for ${EULA_URL}\n`, 'utf-8');
}
/**
 * Get the EULA URL for display purposes.
 */
function getEulaUrl() {
    return EULA_URL;
}
/**
 * Run all preflight checks. Verifies WorkIQ EULA acceptance.
 * Authentication is handled by the WorkIQ CLI and M365 Copilot locally.
 */
function runPreflight(_tenantId) {
    const checks = [];
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
function printPreflightResults(result) {
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
    }
    else {
        console.error('  All preflight checks passed.');
        console.error('');
    }
}
//# sourceMappingURL=setup.js.map