# Evaluation CLI

## Problem

Organizations adopting Microsoft 365 Copilot (WorkIQ) need a way to systematically measure the quality and accuracy of its responses. Manual spot-checking doesn't scale, and there's no built-in mechanism to benchmark WorkIQ against a known-correct set of answers derived from real workplace data (emails, meetings, documents, Teams messages).

Without objective measurement, teams can't confidently answer questions like: *"How accurate is Copilot at finding information in our tenant?"*, *"Did our prompt engineering improvements actually help?"*, or *"Which categories of questions does it struggle with?"*

## Solution

The Evaluation CLI is a prompt evaluation framework that automates the process of benchmarking WorkIQ responses. Given a dataset of questions with known-correct answers, it:

1. **Sends each prompt** to WorkIQ targeting a specific M365 tenant
2. **Records the actual response** returned by WorkIQ
3. **Scores semantic similarity** between the expected and actual answers on a 0–100 scale (also via WorkIQ)
4. **Produces a detailed report** — a markdown document with summary statistics, score distributions, and per-question breakdowns showing exactly where WorkIQ succeeded or fell short

The tool supports **resumability** — if a run is interrupted, re-running picks up where it left off. It accepts evaluation datasets in CSV, TSV, XLSX, or JSON format with flexible column header naming.

## Implementations

Two interchangeable implementations are provided. Both accept the same input formats, produce identical output, and support the same parameters. Choose whichever fits your workflow:

- **[Node.js (TypeScript)](node/README.md)** — Usage, parameters, testing, and architecture
- **[PowerShell](powershell/README.md)** — Usage, parameters, testing, and architecture

## Project Structure

```
EvaluationCLI/
├── node/                          # TypeScript/Node.js implementation
│   ├── src/
│   │   ├── index.ts               #   CLI entry point (commander)
│   │   ├── types.ts               #   Shared interfaces
│   │   ├── evaluator.ts           #   Prompt evaluation loop
│   │   ├── scorer.ts              #   Semantic similarity scoring
│   │   ├── reporter.ts            #   Markdown report generation
│   │   ├── workiq-client.ts       #   WorkIQ integration layer
│   │   ├── readers/               #   CSV, TSV, XLSX, JSON readers
│   │   └── writers/               #   Matching output writers
│   └── tests/                     #   Vitest test suite (28 tests)
│
├── powershell/                    # PowerShell implementation
│   ├── Invoke-Evaluation.ps1      #   CLI entry point
│   ├── src/
│   │   ├── Types.ps1              #   Shared classes
│   │   ├── Evaluator.ps1          #   Prompt evaluation loop
│   │   ├── Scorer.ps1             #   Semantic similarity scoring
│   │   ├── Reporter.ps1           #   Markdown report generation
│   │   ├── WorkIQClient.ps1       #   WorkIQ integration layer
│   │   ├── Readers.ps1            #   CSV, TSV, XLSX, JSON readers
│   │   └── Writers.ps1            #   Matching output writers
│   └── tests/                     #   Pester test suite (24 tests)
│
├── sample-data/                   # Shared example evaluation datasets
│   └── example-eval-set.csv
│
├── .copilot/skills/               # Copilot CLI skill definition
│   └── evaluate.md
│
└── .github/
    └── copilot-instructions.md    # Copilot context for this repository
```

## Evaluation File Format

Evaluation datasets can be CSV, TSV, XLSX, or JSON. Column headers are flexible — the tool normalizes common variations automatically.

| Column | Accepted Header Names | Description |
|--------|----------------------|-------------|
| Prompt | `prompt`, `question`, `Prompt`, `Question` | The question to send to WorkIQ |
| Expected Answer | `expected_answer`, `expectedAnswer`, `Expected Answer` | The known-correct answer |
| Source Location | `source_location`, `sourceLocation`, `Source Location` | Where in M365 the answer is found |
| Actual Answer | `actual_answer`, `actualAnswer`, `Actual Answer` | WorkIQ's response (initially blank) |

## Output

Both implementations produce two files in the output directory:

- **`<input-name>-results.<ext>`** — A copy of the evaluation file with the `actual_answer` and `similarity_score` columns populated
- **`<input-name>-report.md`** — A markdown report containing:
  - Summary statistics (average score, pass rate, min/max)
  - Score distribution chart (Excellent / Good / Fair / Poor)
  - Per-question detail with prompt, expected answer, actual answer, score, and pass/fail status
