#!/usr/bin/env node
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const commander_1 = require("commander");
const readers_1 = require("./readers");
const writers_1 = require("./writers");
const workiq_client_1 = require("./workiq-client");
const evaluator_1 = require("./evaluator");
const scorer_1 = require("./scorer");
const reporter_1 = require("./reporter");
const setup_1 = require("./setup");
async function main() {
    const program = new commander_1.Command();
    program
        .name('evaluation-cli')
        .description('Evaluate WorkIQ answers against a known-correct dataset')
        .option('--input <path>', 'Path to evaluation dataset')
        .option('--system-prompt <text>', 'Inline system prompt')
        .option('--system-prompt-file <path>', 'Path to system prompt file')
        .option('--output-dir <path>', 'Output directory', './output')
        .option('--threshold <number>', 'Pass/fail threshold (0-100)', '70')
        .option('--tenant-id <id>', 'Microsoft 365 tenant ID to target')
        .option('--setup', 'Run preflight checks and setup only')
        .option('--skip-preflight', 'Skip preflight checks')
        .parse(process.argv);
    const opts = program.opts();
    // Handle setup-only mode
    if (opts.setup) {
        const preflightResult = (0, setup_1.runPreflight)(opts.tenantId);
        (0, setup_1.printPreflightResults)(preflightResult);
        if (!(0, setup_1.checkEulaAccepted)()) {
            console.error(`  WorkIQ EULA: ${(0, setup_1.getEulaUrl)()}`);
            console.error('  To accept, run this command:');
            console.error(`    echo "accepted" > "${process.env.USERPROFILE || process.env.HOME}/.workiq-eula-accepted"`);
            console.error('');
        }
        process.exit(preflightResult.passed ? 0 : 1);
    }
    const options = {
        input: opts.input ?? '',
        systemPrompt: opts.systemPrompt,
        systemPromptFile: opts.systemPromptFile,
        outputDir: opts.outputDir,
        threshold: Number(opts.threshold),
        tenantId: opts.tenantId,
    };
    if (!options.input) {
        throw new Error('--input <path> is required. Use --setup to run preflight checks only.');
    }
    // Validate input file exists
    const inputPath = path.resolve(options.input);
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file not found: ${inputPath}`);
    }
    // Run preflight checks (unless skipped)
    if (!opts.skipPreflight) {
        const preflightResult = (0, setup_1.runPreflight)(options.tenantId);
        (0, setup_1.printPreflightResults)(preflightResult);
        if (!preflightResult.passed) {
            console.error('  Use --skip-preflight to bypass these checks.');
            process.exit(1);
        }
    }
    // Resolve system prompt
    const systemPrompt = (0, workiq_client_1.resolveSystemPrompt)(options.systemPrompt, options.systemPromptFile);
    // Print startup banner to stderr
    console.error('╔══════════════════════════════════════════════╗');
    console.error('║           EvaluationCLI - Starting           ║');
    console.error('╚══════════════════════════════════════════════╝');
    console.error(`  Input file:    ${inputPath}`);
    console.error(`  Output dir:    ${path.resolve(options.outputDir)}`);
    console.error(`  Threshold:     ${options.threshold}%`);
    if (options.tenantId) {
        console.error(`  Tenant ID:     ${options.tenantId}`);
    }
    if (systemPrompt) {
        const preview = systemPrompt.length > 60 ? systemPrompt.slice(0, 60) + '...' : systemPrompt;
        console.error(`  System prompt: ${preview}`);
    }
    console.error('');
    // Ensure output directory exists
    fs.mkdirSync(path.resolve(options.outputDir), { recursive: true });
    // Read input file
    console.error('Reading input file...');
    const { rows, format } = await (0, readers_1.readEvalFile)(inputPath);
    console.error(`  Loaded ${rows.length} evaluation rows (${format} format)`);
    // Create WorkIQ client
    const client = new workiq_client_1.CliWorkIQClient();
    // Evaluate prompts
    console.error('\nEvaluating prompts...');
    const evaluatedRows = await (0, evaluator_1.evaluatePrompts)(rows, client, {
        systemPrompt,
        tenantId: options.tenantId,
        onProgress: (completed, total, currentPrompt) => {
            const preview = currentPrompt.length > 50 ? currentPrompt.slice(0, 50) + '...' : currentPrompt;
            console.error(`  [${completed}/${total}] ${preview}`);
        },
    });
    // Score answers
    console.error('\nScoring answers...');
    const scoredRows = await (0, scorer_1.scoreAnswers)(evaluatedRows, client, {
        tenantId: options.tenantId,
        onProgress: (completed, total) => {
            console.error(`  [${completed}/${total}] Scoring...`);
        },
    });
    // Calculate scoring result
    const scoringResult = (0, scorer_1.calculateScoringResult)(scoredRows, options.threshold);
    // Build EvalResult
    const evalResult = {
        rows: scoredRows,
        inputFile: inputPath,
        inputFormat: format,
        timestamp: new Date().toISOString(),
        systemPrompt,
    };
    // Generate and write report
    console.error('\nGenerating report...');
    const report = (0, reporter_1.generateReport)(evalResult, scoringResult);
    const reportPath = await (0, reporter_1.writeReport)(report, path.resolve(options.outputDir), inputPath);
    // Write completed evaluation file
    const evalOutputPath = await (0, writers_1.writeEvalFile)(scoredRows, inputPath, path.resolve(options.outputDir), format);
    // Print summary to stdout
    const passRate = scoringResult.totalQuestions > 0
        ? ((scoringResult.passCount / scoringResult.totalQuestions) * 100).toFixed(1)
        : '0.0';
    console.log('\n=== Evaluation Complete ===');
    console.log(`  Report:          ${reportPath}`);
    console.log(`  Evaluation file: ${evalOutputPath}`);
    console.log(`  Average score:   ${scoringResult.averageScore.toFixed(1)}%`);
    console.log(`  Pass rate:       ${passRate}% (${scoringResult.passCount}/${scoringResult.totalQuestions})`);
    console.log(`  Threshold:       ${scoringResult.passThreshold}%`);
    // Exit with code 0 if all pass, 1 if any fail
    if (scoringResult.failCount > 0) {
        console.log(`\n  ✗ ${scoringResult.failCount} question(s) below threshold`);
        process.exit(1);
    }
    else {
        console.log('\n  ✓ All questions passed');
        process.exit(0);
    }
}
main().catch((err) => {
    console.error(`\nError: ${err.message}`);
    process.exit(2);
});
//# sourceMappingURL=index.js.map