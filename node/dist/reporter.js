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
exports.generateReport = generateReport;
exports.writeReport = writeReport;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
function buildScoreBuckets(rows) {
    const buckets = [
        { label: 'Excellent', range: '90-100', min: 90, max: 100, count: 0 },
        { label: 'Good', range: '70-89', min: 70, max: 89, count: 0 },
        { label: 'Fair', range: '50-69', min: 50, max: 69, count: 0 },
        { label: 'Poor', range: '0-49', min: 0, max: 49, count: 0 },
    ];
    for (const row of rows) {
        if (row.similarityScore == null)
            continue;
        const score = row.similarityScore;
        for (const bucket of buckets) {
            if (score >= bucket.min && score <= bucket.max) {
                bucket.count++;
                break;
            }
        }
    }
    return buckets;
}
function makeBar(count, maxCount) {
    if (maxCount === 0)
        return '';
    const maxWidth = 20;
    const width = Math.round((count / maxCount) * maxWidth);
    return '█'.repeat(width);
}
function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
}
function formatPercentage(count, total) {
    if (total === 0)
        return '0';
    return ((count / total) * 100).toFixed(0);
}
/**
 * Generate a markdown evaluation report from evaluation and scoring results.
 */
function generateReport(evalResult, scoringResult) {
    const lines = [];
    // Title
    lines.push('# Evaluation Report');
    lines.push('');
    // Summary
    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Input File:** ${evalResult.inputFile}`);
    lines.push(`- **Input Format:** ${evalResult.inputFormat}`);
    lines.push(`- **Timestamp:** ${evalResult.timestamp}`);
    if (evalResult.systemPrompt != null) {
        lines.push(`- **System Prompt:** ${truncate(evalResult.systemPrompt, 200)}`);
    }
    lines.push(`- **Total Questions:** ${scoringResult.totalQuestions}`);
    lines.push(`- **Average Score:** ${scoringResult.averageScore.toFixed(1)}`);
    lines.push(`- **Min Score:** ${scoringResult.minScore}`);
    lines.push(`- **Max Score:** ${scoringResult.maxScore}`);
    const passPercentage = formatPercentage(scoringResult.passCount, scoringResult.totalQuestions);
    lines.push(`- **Pass Rate:** ${scoringResult.passCount}/${scoringResult.totalQuestions} (${passPercentage}%)`);
    lines.push(`- **Pass Threshold:** ${scoringResult.passThreshold}`);
    lines.push('');
    // Score Distribution
    lines.push('## Score Distribution');
    lines.push('');
    const buckets = buildScoreBuckets(evalResult.rows);
    const maxCount = Math.max(...buckets.map((b) => b.count));
    for (const bucket of buckets) {
        const bar = makeBar(bucket.count, maxCount);
        const pct = formatPercentage(bucket.count, scoringResult.totalQuestions);
        lines.push(`${bucket.label} (${bucket.range}): ${bar} ${bucket.count} (${pct}%)`);
    }
    lines.push('');
    // Detailed Results
    lines.push('## Detailed Results');
    lines.push('');
    evalResult.rows.forEach((row, index) => {
        const n = index + 1;
        const promptPreview = truncate(row.prompt, 60);
        lines.push(`### Question ${n}: ${promptPreview}`);
        lines.push('');
        if (row.similarityScore != null) {
            const passed = row.similarityScore >= scoringResult.passThreshold;
            const icon = passed ? '✅' : '❌';
            lines.push(`**Score:** ${row.similarityScore}/100 ${icon}`);
        }
        else {
            lines.push('**Score:** N/A');
        }
        lines.push('');
        lines.push(`**Source:** ${row.sourceLocation}`);
        lines.push('');
        lines.push('**Prompt:**');
        lines.push(`> ${row.prompt}`);
        lines.push('');
        lines.push('**Expected Answer:**');
        lines.push(`> ${row.expectedAnswer}`);
        lines.push('');
        lines.push('**Actual Answer:**');
        lines.push(`> ${row.actualAnswer}`);
        lines.push('');
    });
    return lines.join('\n');
}
/**
 * Write a report string to a markdown file in the specified output directory.
 * Creates the output directory if it doesn't exist.
 * Returns the full path of the written file.
 */
async function writeReport(report, outputDir, inputFile) {
    await fs.mkdir(outputDir, { recursive: true });
    const baseName = path.basename(inputFile, path.extname(inputFile));
    const outputPath = path.join(outputDir, `${baseName}-report.md`);
    await fs.writeFile(outputPath, report, 'utf-8');
    return outputPath;
}
//# sourceMappingURL=reporter.js.map