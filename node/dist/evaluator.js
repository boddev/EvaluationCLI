"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePrompts = evaluatePrompts;
const workiq_client_1 = require("./workiq-client");
const DELAY_MS = 500;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function evaluatePrompts(rows, client, options) {
    const total = rows.length;
    for (let i = 0; i < total; i++) {
        const row = rows[i];
        if (row.actualAnswer) {
            continue;
        }
        process.stderr.write(`\rProcessing prompt ${i + 1}/${total}...`);
        const fullPrompt = (0, workiq_client_1.buildPrompt)(row.prompt, options?.systemPrompt);
        try {
            const response = await client.ask(fullPrompt, options?.tenantId);
            row.actualAnswer = response.trim();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            row.actualAnswer = `[ERROR: ${message}]`;
        }
        options?.onProgress?.(i + 1, total, row.prompt);
        if (i < total - 1) {
            await delay(DELAY_MS);
        }
    }
    process.stderr.write('\n');
    return rows;
}
//# sourceMappingURL=evaluator.js.map