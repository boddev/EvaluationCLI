import { EvalRow, InputFormat } from '../types';
export { writeCsv } from './csv-writer';
export { writeXlsx } from './xlsx-writer';
export { writeJson } from './json-writer';
export declare function writeEvalFile(rows: EvalRow[], inputFile: string, outputDir: string, format: InputFormat): Promise<string>;
//# sourceMappingURL=index.d.ts.map