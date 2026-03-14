import { EvalRow } from './types';
import { WorkIQClient } from './workiq-client';
export interface EvaluateOptions {
    systemPrompt?: string;
    tenantId?: string;
    onProgress?: (completed: number, total: number, currentPrompt: string) => void;
}
export declare function evaluatePrompts(rows: EvalRow[], client: WorkIQClient, options?: EvaluateOptions): Promise<EvalRow[]>;
//# sourceMappingURL=evaluator.d.ts.map