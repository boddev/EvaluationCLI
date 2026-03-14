import { EvalRow } from '../types';
/**
 * Build a mapping from raw column headers to canonical EvalRow field names.
 * Throws if any required column (prompt, expectedAnswer, sourceLocation) is missing.
 */
export declare function normalizeHeaders(rawHeaders: string[]): Map<string, keyof EvalRow>;
/**
 * Convert a raw record (keyed by original headers) into an EvalRow
 * using the mapping produced by normalizeHeaders.
 */
export declare function mapRow(record: Record<string, string>, headerMap: Map<string, keyof EvalRow>): EvalRow;
//# sourceMappingURL=normalize.d.ts.map