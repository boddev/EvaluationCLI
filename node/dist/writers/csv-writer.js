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
exports.writeCsv = writeCsv;
const sync_1 = require("csv-stringify/sync");
const fs = __importStar(require("fs"));
const COLUMNS = ['prompt', 'expected_answer', 'source_location', 'actual_answer', 'similarity_score'];
async function writeCsv(rows, outputPath, delimiter) {
    const records = rows.map((row) => ({
        prompt: row.prompt,
        expected_answer: row.expectedAnswer,
        source_location: row.sourceLocation,
        actual_answer: row.actualAnswer,
        similarity_score: row.similarityScore ?? '',
    }));
    const output = (0, sync_1.stringify)(records, {
        header: true,
        columns: COLUMNS,
        delimiter: delimiter ?? ',',
    });
    fs.writeFileSync(outputPath, output, 'utf-8');
}
//# sourceMappingURL=csv-writer.js.map