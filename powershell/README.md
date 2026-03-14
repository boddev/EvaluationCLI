# Evaluation CLI — PowerShell

PowerShell implementation of the Evaluation CLI tool for evaluating WorkIQ (M365 Copilot) responses.

## Prerequisites

- **PowerShell 7+** — [Download](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell)
- **GitHub Copilot CLI** — [Install guide](https://docs.github.com/en/copilot/github-copilot-in-the-cli/using-github-copilot-in-the-cli)
- **WorkIQ MCP Server** — [GitHub](https://github.com/microsoft/work-iq-mcp) — Required for sending prompts to Microsoft 365 Copilot. Must be configured as an MCP server in the Copilot CLI and the EULA accepted before first use.
- **Pester 5+** (for tests) — `Install-Module Pester -MinimumVersion 5.0.0 -Scope CurrentUser`
- **ImportExcel** (for XLSX support) — [PowerShell Gallery](https://www.powershellgallery.com/packages/ImportExcel) — `Install-Module ImportExcel -Scope CurrentUser`

## Setup

Before running evaluations, use the `-Setup` flag to verify your environment is correctly configured. This runs preflight checks to ensure the WorkIQ EULA has been accepted and that the WorkIQ service is reachable.

```powershell
# Run setup / preflight checks
.\Invoke-Evaluation.ps1 -Setup

# Run setup targeting a specific tenant
.\Invoke-Evaluation.ps1 -Setup -TenantId "your-tenant-id-here"
```

The setup process will:

1. **Check WorkIQ EULA acceptance** — If the EULA has not been accepted, you will be prompted to review and accept it interactively.
2. **Test WorkIQ connectivity** — Sends a test prompt to confirm the WorkIQ service is responding.

If all checks pass you are ready to run evaluations. If any check fails, the output will include instructions on how to resolve the issue.

> **Tip:** You can skip preflight checks on subsequent runs with `-SkipPreflight` once your environment is verified.

## Usage

```powershell
# Basic usage
.\Invoke-Evaluation.ps1 -InputFile .\eval-set.csv

# With system prompt
.\Invoke-Evaluation.ps1 -InputFile .\eval-set.csv -SystemPrompt "Answer concisely based on M365 data"

# With system prompt file and custom threshold
.\Invoke-Evaluation.ps1 -InputFile .\eval-set.xlsx -SystemPromptFile .\prompts\system.md -Threshold 80

# Custom output directory
.\Invoke-Evaluation.ps1 -InputFile .\eval-set.json -OutputDir .\results

# Target a specific M365 tenant
.\Invoke-Evaluation.ps1 -InputFile .\eval-set.csv -TenantId "your-tenant-id-here"

# Skip preflight checks (after initial setup)
.\Invoke-Evaluation.ps1 -InputFile .\eval-set.csv -SkipPreflight
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `-InputFile <path>` | Yes* | Path to evaluation dataset (CSV, TSV, XLSX, or JSON). *Not required when using `-Setup`. |
| `-SystemPrompt <text>` | No | System prompt to prepend to each question |
| `-SystemPromptFile <path>` | No | Path to a file containing the system prompt |
| `-OutputDir <path>` | No | Output directory (default: `./output`) |
| `-Threshold <int>` | No | Pass/fail score threshold 0–100 (default: `70`) |
| `-TenantId <string>` | No | Microsoft 365 tenant ID to target for WorkIQ queries |
| `-Setup` | No | Run preflight checks only (EULA acceptance, connectivity test) — no evaluation is performed |
| `-SkipPreflight` | No | Skip preflight checks and start evaluation immediately |

## Running Tests

```powershell
# Run all tests
Invoke-Pester -Path tests -Output Detailed

# Run a single test file
Invoke-Pester -Path tests\Readers.Tests.ps1 -Output Detailed

# Run tests matching a name pattern
Invoke-Pester -Path tests -Output Detailed -Filter @{ FullName = '*CSV*' }
```

## Architecture

```
powershell/
├── Invoke-Evaluation.ps1    # CLI entry point
├── src/
│   ├── Types.ps1            # Shared PowerShell classes
│   ├── Readers.ps1          # File format readers (CSV, TSV, XLSX, JSON)
│   ├── Writers.ps1          # File format writers
│   ├── WorkIQClient.ps1     # WorkIQ CLI integration (pluggable)
│   ├── Evaluator.ps1        # Prompt evaluation loop
│   ├── Scorer.ps1           # Semantic similarity scoring
│   ├── Reporter.ps1         # Markdown report generation
│   └── Setup.ps1            # Preflight checks (EULA, connectivity)
└── tests/
    ├── Readers.Tests.ps1
    ├── Writers.Tests.ps1
    ├── Evaluator.Tests.ps1
    ├── Scorer.Tests.ps1
    └── Reporter.Tests.ps1
```
