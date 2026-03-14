"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockWorkIQClient = exports.CliWorkIQClient = void 0;
exports.buildPrompt = buildPrompt;
exports.resolveSystemPrompt = resolveSystemPrompt;
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
/**
 * Build the full prompt by prepending the system prompt (if any) to the user's question.
 */
function buildPrompt(question, systemPrompt) {
    if (!systemPrompt)
        return question;
    return `${systemPrompt}\n\n${question}`;
}
/**
 * Load a system prompt from either an inline string or a file path.
 * If both are provided, the inline string takes precedence.
 */
function resolveSystemPrompt(inlinePrompt, promptFilePath) {
    if (inlinePrompt)
        return inlinePrompt;
    if (promptFilePath) {
        return fs.readFileSync(promptFilePath, 'utf-8').trim();
    }
    return undefined;
}
/**
 * WorkIQ client that invokes the `workiq` CLI directly.
 *
 * Usage:
 *   workiq ask -q "question" -t "tenantId"
 *
 * The workiq CLI handles authentication and communication with M365 Copilot.
 */
class CliWorkIQClient {
    timeoutMs;
    constructor(options) {
        this.timeoutMs = options?.timeoutMs ?? 120000;
    }
    async ask(question, tenantId) {
        // Tenant ID is a root-level flag (before the subcommand)
        // Usage: workiq [-t tenantId] ask -q "question"
        const args = [];
        if (tenantId) {
            args.push('-t', tenantId);
        }
        args.push('ask', '-q', question);
        const result = (0, child_process_1.spawnSync)('workiq', args, {
            encoding: 'utf-8',
            timeout: this.timeoutMs,
            stdio: ['pipe', 'pipe', 'pipe'],
        });
        if (result.error) {
            if (result.error.code === 'ETIMEDOUT') {
                throw new Error(`WorkIQ request timed out after ${this.timeoutMs}ms`);
            }
            throw new Error(`WorkIQ CLI error: ${result.error.message}`);
        }
        if (result.status !== 0) {
            const stderr = (result.stderr || '').trim();
            throw new Error(`workiq CLI exited with code ${result.status}: ${stderr || result.stdout}`);
        }
        const output = (result.stdout || '').trim();
        if (!output) {
            throw new Error('WorkIQ returned an empty response.');
        }
        return output;
    }
}
exports.CliWorkIQClient = CliWorkIQClient;
/**
 * Simple in-memory mock client for testing.
 */
class MockWorkIQClient {
    responses;
    defaultResponse;
    constructor(responses, defaultResponse) {
        this.responses = new Map(Object.entries(responses ?? {}));
        this.defaultResponse = defaultResponse ?? 'Mock response';
    }
    async ask(question, tenantId) {
        return this.responses.get(question) ?? this.defaultResponse;
    }
}
exports.MockWorkIQClient = MockWorkIQClient;
//# sourceMappingURL=workiq-client.js.map