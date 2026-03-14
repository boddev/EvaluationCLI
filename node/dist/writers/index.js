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
exports.writeJson = exports.writeXlsx = exports.writeCsv = void 0;
exports.writeEvalFile = writeEvalFile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const csv_writer_1 = require("./csv-writer");
const xlsx_writer_1 = require("./xlsx-writer");
const json_writer_1 = require("./json-writer");
var csv_writer_2 = require("./csv-writer");
Object.defineProperty(exports, "writeCsv", { enumerable: true, get: function () { return csv_writer_2.writeCsv; } });
var xlsx_writer_2 = require("./xlsx-writer");
Object.defineProperty(exports, "writeXlsx", { enumerable: true, get: function () { return xlsx_writer_2.writeXlsx; } });
var json_writer_2 = require("./json-writer");
Object.defineProperty(exports, "writeJson", { enumerable: true, get: function () { return json_writer_2.writeJson; } });
const EXTENSION_MAP = {
    csv: '.csv',
    tsv: '.tsv',
    xlsx: '.xlsx',
    json: '.json',
};
async function writeEvalFile(rows, inputFile, outputDir, format) {
    fs.mkdirSync(outputDir, { recursive: true });
    const baseName = path.basename(inputFile, path.extname(inputFile));
    const outputFileName = `${baseName}-results${EXTENSION_MAP[format]}`;
    const outputPath = path.join(outputDir, outputFileName);
    switch (format) {
        case 'csv':
            await (0, csv_writer_1.writeCsv)(rows, outputPath);
            break;
        case 'tsv':
            await (0, csv_writer_1.writeCsv)(rows, outputPath, '\t');
            break;
        case 'xlsx':
            await (0, xlsx_writer_1.writeXlsx)(rows, outputPath);
            break;
        case 'json':
            await (0, json_writer_1.writeJson)(rows, outputPath);
            break;
    }
    return outputPath;
}
//# sourceMappingURL=index.js.map