export interface PreflightResult {
    passed: boolean;
    checks: {
        name: string;
        passed: boolean;
        message: string;
    }[];
}
/**
 * Check if the WorkIQ EULA has been accepted (marker file exists).
 */
export declare function checkEulaAccepted(): boolean;
/**
 * Record EULA acceptance by writing a marker file.
 */
export declare function recordEulaAcceptance(): void;
/**
 * Get the EULA URL for display purposes.
 */
export declare function getEulaUrl(): string;
/**
 * Run all preflight checks. Verifies WorkIQ EULA acceptance.
 * Authentication is handled by the WorkIQ CLI and M365 Copilot locally.
 */
export declare function runPreflight(_tenantId?: string): PreflightResult;
/**
 * Print preflight results to stderr.
 */
export declare function printPreflightResults(result: PreflightResult): void;
//# sourceMappingURL=setup.d.ts.map