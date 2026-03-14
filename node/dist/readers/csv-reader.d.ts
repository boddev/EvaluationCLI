import { EvalRow } from '../types';
/**
 * Read a CSV (or TSV) file and return an array of EvalRow objects.
 * Automatically detects whether the first row is a header or data.
 */
export declare function readCsv(filePath: string, delimiter?: string): Promise<EvalRow[]>;
//# sourceMappingURL=csv-reader.d.ts.map