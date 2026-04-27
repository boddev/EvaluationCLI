# Environment Datasets

Sample environmental source data for testing `eval-gen` with a multi-file Copilot connector dataset.

The folder includes:

- `owid/owid-co2-data.csv` from Our World in Data.
- `worldbank/*.json` raw World Bank climate and environmental indicator responses.
- `worldbank/*.csv` CSV copies of the World Bank indicators for tabular eval generation.
- `emdat/emdat-download-required.json`, a placeholder describing the EM-DAT manual download requirement.
- `manifest.json`, inventory metadata for the included sources.

Use the CSV files when generating a tabular eval set from the whole sample:

```powershell
eval-gen `
  --file ".\environment-datasets" `
  --extensions csv `
  --description "Environmental datasets for the NGO environment Copilot connector, including Our World in Data CO2 and greenhouse gas metrics plus World Bank climate and environmental indicators by country or region and year." `
  --count 50 `
  --connector-schema ".\eval-gen\examples\environment-datasets-connector-schema.json" `
  --output ".\eval-output\environment-datasets-eval.csv"
```
