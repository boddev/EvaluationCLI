import { EvalRow, InputFormat } from '../types';
export { readCsv } from './csv-reader';
export { readXlsx } from './xlsx-reader';
export { readJson } from './json-reader';
export { normalizeHeaders } from './normalize';
/**
 * Read an evaluation file, auto-detecting format from the file extension.
 * Returns the parsed rows and the detected format.
 */
export declare function readEvalFile(filePath: string): Promise<{
    rows: EvalRow[];
    format: InputFormat;
}>;
//# sourceMappingURL=index.d.ts.map