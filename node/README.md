# Evaluation CLI — Node.js

TypeScript/Node.js implementation of the Evaluation CLI tool for evaluating WorkIQ (M365 Copilot) responses.

## Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **npm** — Included with Node.js
- **GitHub Copilot CLI** — [Install guide](https://docs.github.com/en/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli)
- **WorkIQ MCP Server** — [GitHub](https://github.com/microsoft/work-iq-mcp) — Required for sending prompts to Microsoft 365 Copilot. Must be configured as an MCP server in the Copilot CLI and the EULA accepted before first use.

## Installation

```bash
npm install
```

## Setup

Before running evaluations, use the `--setup` flag to verify your environment is correctly configured. This runs preflight checks to ensure the WorkIQ EULA has been accepted.

```bash
# Run setup / preflight checks
npx ts-node src/index.ts --setup

# Run setup targeting a specific tenant
npx ts-node src/index.ts --setup --tenant-id "your-tenant-id-here"
```

The setup process will:

1. **Check WorkIQ EULA acceptance** — Verifies the EULA has been accepted. If not, it provides instructions on how to accept it (create the marker file or run the PowerShell implementation's interactive setup).

If all checks pass you are ready to run evaluations. If any check fails, the output will include instructions on how to resolve the issue.

> **Tip:** You can skip preflight checks on subsequent runs with `--skip-preflight` once your environment is verified.

## Usage

```bash
# Basic usage
npx ts-node src/index.ts --input eval-set.csv

# With a system prompt
npx ts-node src/index.ts --input eval-set.csv --system-prompt "Answer concisely based on M365 data"

# With a system prompt file and custom threshold
npx ts-node src/index.ts --input eval-set.xlsx --system-prompt-file ./prompts/system.md --threshold 80

# Custom output directory
npx ts-node src/index.ts --input eval-set.json --output-dir ./results

# Target a specific M365 tenant
npx ts-node src/index.ts --input eval-set.csv --tenant-id "your-tenant-id-here"

# Skip preflight checks (after initial setup)
npx ts-node src/index.ts --input eval-set.csv --skip-preflight
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `--input <path>` | Yes* | Path to evaluation dataset (CSV, TSV, XLSX, or JSON). *Not required when using `--setup`. |
| `--system-prompt <text>` | No | System prompt to prepend to each question |
| `--system-prompt-file <path>` | No | Path to a file containing the system prompt |
| `--output-dir <path>` | No | Output directory (default: `./output`) |
| `--threshold <number>` | No | Pass/fail score threshold 0–100 (default: `70`) |
| `--tenant-id <id>` | No | Microsoft 365 tenant ID to target for WorkIQ queries |
| `--setup` | No | Run preflight checks only (EULA acceptance) — no evaluation is performed |
| `--skip-preflight` | No | Skip preflight checks and start evaluation immediately |

## Running Tests

```bash
# Run all tests
npm test

# Run a single test file
npx vitest run tests/readers.test.ts

# Run tests matching a name pattern
npx vitest run -t "test name pattern"
```

## Architecture

```
src/
├── index.ts          # CLI entry point and orchestration
├── types.ts          # Shared TypeScript interfaces
├── evaluator.ts      # Sends prompts to WorkIQ, records responses
├── scorer.ts         # Semantic similarity scoring via WorkIQ
├── reporter.ts       # Markdown report generation
├── setup.ts          # Preflight checks (EULA acceptance)
├── workiq-client.ts  # WorkIQ CLI integration (pluggable interface)
├── readers/          # File format readers (CSV, TSV, XLSX, JSON)
└── writers/          # File format writers (matching input format)
```
