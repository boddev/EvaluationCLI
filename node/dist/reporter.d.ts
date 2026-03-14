import { EvalResult, ScoringResult } from './types';
/**
 * Generate a markdown evaluation report from evaluation and scoring results.
 */
export declare function generateReport(evalResult: EvalResult, scoringResult: ScoringResult): string;
/**
 * Write a report string to a markdown file in the specified output directory.
 * Creates the output directory if it doesn't exist.
 * Returns the full path of the written file.
 */
export declare function writeReport(report: string, outputDir: string, inputFile: string): Promise<string>;
//# sourceMappingURL=reporter.d.ts.map