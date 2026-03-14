"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeHeaders = normalizeHeaders;
exports.mapRow = mapRow;
/**
 * Maps common header variations to canonical EvalRow field names.
 */
const HEADER_ALIASES = {
    // prompt
    'prompt': 'prompt',
    'question': 'prompt',
    // expectedAnswer
    'expectedanswer': 'expectedAnswer',
    'expected_answer': 'expectedAnswer',
    'expected answer': 'expectedAnswer',
    // sourceLocation
    'sourcelocation': 'sourceLocation',
    'source_location': 'sourceLocation',
    'source location': 'sourceLocation',
    // actualAnswer
    'actualanswer': 'actualAnswer',
    'actual_answer': 'actualAnswer',
    'actual answer': 'actualAnswer',
};
/**
 * Build a mapping from raw column headers to canonical EvalRow field names.
 * Throws if any required column (prompt, expectedAnswer, sourceLocation) is missing.
 */
function normalizeHeaders(rawHeaders) {
    const mapping = new Map();
    for (const raw of rawHeaders) {
        const key = raw.trim().toLowerCase();
        const canonical = HEADER_ALIASES[key];
        if (canonical) {
            mapping.set(raw, canonical);
        }
    }
    const resolved = new Set(mapping.values());
    const required = ['prompt', 'expectedAnswer', 'sourceLocation'];
    const missing = required.filter((f) => !resolved.has(f));
    if (missing.length > 0) {
        throw new Error(`Missing required column(s): ${missing.join(', ')}. ` +
            `Found columns: [${rawHeaders.join(', ')}]`);
    }
    return mapping;
}
/**
 * Convert a raw record (keyed by original headers) into an EvalRow
 * using the mapping produced by normalizeHeaders.
 */
function mapRow(record, headerMap) {
    const values = {
        prompt: '',
        expectedAnswer: '',
        sourceLocation: '',
        actualAnswer: '',
    };
    for (const [rawHeader, canonical] of headerMap) {
        if (canonical in values) {
            const value = record[rawHeader];
            if (value !== undefined && value !== null) {
                values[canonical] = String(value);
            }
        }
    }
    return { ...values };
}
//# sourceMappingURL=normalize.js.map