/**
 * Interface for querying WorkIQ (or any LLM backend).
 * The workiq CLI provides the real implementation;
 * tests can provide a mock.
 */
export interface WorkIQClient {
    ask(question: string, tenantId?: string): Promise<string>;
}
/**
 * Build the full prompt by prepending the system prompt (if any) to the user's question.
 */
export declare function buildPrompt(question: string, systemPrompt?: string): string;
/**
 * Load a system prompt from either an inline string or a file path.
 * If both are provided, the inline string takes precedence.
 */
export declare function resolveSystemPrompt(inlinePrompt?: string, promptFilePath?: string): string | undefined;
/**
 * WorkIQ client that invokes the `workiq` CLI directly.
 *
 * Usage:
 *   workiq ask -q "question" -t "tenantId"
 *
 * The workiq CLI handles authentication and communication with M365 Copilot.
 */
export declare class CliWorkIQClient implements WorkIQClient {
    private timeoutMs;
    constructor(options?: {
        timeoutMs?: number;
    });
    ask(question: string, tenantId?: string): Promise<string>;
}
/**
 * Simple in-memory mock client for testing.
 */
export declare class MockWorkIQClient implements WorkIQClient {
    private responses;
    private defaultResponse;
    constructor(responses?: Record<string, string>, defaultResponse?: string);
    ask(question: string, tenantId?: string): Promise<string>;
}
//# sourceMappingURL=workiq-client.d.ts.map