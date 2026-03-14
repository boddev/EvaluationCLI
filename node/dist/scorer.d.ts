import { EvalRow, ScoringResult } from './types';
import { WorkIQClient } from './workiq-client';
export declare function scoreAnswers(rows: EvalRow[], client: WorkIQClient, options?: {
    tenantId?: string;
    onProgress?: (completed: number, total: number) => void;
}): Promise<EvalRow[]>;
export declare function calculateScoringResult(rows: EvalRow[], passThreshold: number): ScoringResult;
//# sourceMappingURL=scorer.d.ts.map