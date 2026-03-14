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
exports.readJson = readJson;
const fs = __importStar(require("fs"));
const normalize_1 = require("./normalize");
/**
 * Read a JSON file and return an array of EvalRow objects.
 * Expects the file to contain a JSON array of objects.
 */
async function readJson(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let parsed;
    try {
        parsed = JSON.parse(content);
    }
    catch (err) {
        throw new Error(`Failed to parse JSON from ${filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (!Array.isArray(parsed)) {
        throw new Error(`Expected a JSON array in ${filePath}, but got ${typeof parsed}`);
    }
    if (parsed.length === 0) {
        return [];
    }
    const records = parsed;
    const rawHeaders = Object.keys(records[0]);
    const headerMap = (0, normalize_1.normalizeHeaders)(rawHeaders);
    return records.map((record) => (0, normalize_1.mapRow)(record, headerMap));
}
//# sourceMappingURL=json-reader.js.map