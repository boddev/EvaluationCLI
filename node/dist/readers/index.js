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
exports.normalizeHeaders = exports.readJson = exports.readXlsx = exports.readCsv = void 0;
exports.readEvalFile = readEvalFile;
const path = __importStar(require("path"));
const csv_reader_1 = require("./csv-reader");
const xlsx_reader_1 = require("./xlsx-reader");
const json_reader_1 = require("./json-reader");
var csv_reader_2 = require("./csv-reader");
Object.defineProperty(exports, "readCsv", { enumerable: true, get: function () { return csv_reader_2.readCsv; } });
var xlsx_reader_2 = require("./xlsx-reader");
Object.defineProperty(exports, "readXlsx", { enumerable: true, get: function () { return xlsx_reader_2.readXlsx; } });
var json_reader_2 = require("./json-reader");
Object.defineProperty(exports, "readJson", { enumerable: true, get: function () { return json_reader_2.readJson; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "normalizeHeaders", { enumerable: true, get: function () { return normalize_1.normalizeHeaders; } });
const EXTENSION_FORMAT_MAP = {
    '.csv': 'csv',
    '.tsv': 'tsv',
    '.xlsx': 'xlsx',
    '.json': 'json',
};
/**
 * Read an evaluation file, auto-detecting format from the file extension.
 * Returns the parsed rows and the detected format.
 */
async function readEvalFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const format = EXTENSION_FORMAT_MAP[ext];
    if (!format) {
        const supported = Object.keys(EXTENSION_FORMAT_MAP).join(', ');
        throw new Error(`Unsupported file extension "${ext}". Supported extensions: ${supported}`);
    }
    let rows;
    switch (format) {
        case 'csv':
            rows = await (0, csv_reader_1.readCsv)(filePath);
            break;
        case 'tsv':
            rows = await (0, csv_reader_1.readCsv)(filePath, '\t');
            break;
        case 'xlsx':
            rows = await (0, xlsx_reader_1.readXlsx)(filePath);
            break;
        case 'json':
            rows = await (0, json_reader_1.readJson)(filePath);
            break;
    }
    return { rows, format };
}
//# sourceMappingURL=index.js.map