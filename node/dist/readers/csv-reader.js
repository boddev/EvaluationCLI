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
exports.readCsv = readCsv;
const fs = __importStar(require("fs"));
const sync_1 = require("csv-parse/sync");
const normalize_1 = require("./normalize");
const HEADER_KEYWORDS = [
    'prompt', 'question',
    'expected_answer', 'expectedanswer', 'expected answer',
    'source_location', 'sourcelocation', 'source location',
    'actual_answer', 'actualanswer', 'actual answer',
];
/**
 * Detect whether the first row of a delimited file is a header row
 * by checking if any field matches a known column name.
 */
function hasHeaderRow(firstLine, delimiter) {
    const fields = firstLine.split(delimiter).map(f => f.trim().replace(/^"|"$/g, '').toLowerCase());
    return fields.some(f => HEADER_KEYWORDS.includes(f));
}
/**
 * Read a CSV (or TSV) file and return an array of EvalRow objects.
 * Automatically detects whether the first row is a header or data.
 */
async function readCsv(filePath, delimiter = ',') {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length === 0) {
        return [];
    }
    const firstRowIsHeader = hasHeaderRow(lines[0], delimiter);
    let records;
    if (firstRowIsHeader) {
        records = (0, sync_1.parse)(content, {
            columns: true,
            skip_empty_lines: true,
            delimiter,
            trim: true,
        });
    }
    else {
        // No header row — assign positional column names
        const positionalHeaders = ['prompt', 'expected_answer', 'source_location', 'actual_answer'];
        const fieldCount = lines[0].split(delimiter).length;
        const columns = [];
        for (let i = 0; i < fieldCount; i++) {
            columns.push(i < positionalHeaders.length ? positionalHeaders[i] : `column_${i + 1}`);
        }
        records = (0, sync_1.parse)(content, {
            columns,
            skip_empty_lines: true,
            delimiter,
            trim: true,
        });
    }
    if (records.length === 0) {
        return [];
    }
    const rawHeaders = Object.keys(records[0]);
    const headerMap = (0, normalize_1.normalizeHeaders)(rawHeaders);
    return records.map((record) => (0, normalize_1.mapRow)(record, headerMap));
}
//# sourceMappingURL=csv-reader.js.map