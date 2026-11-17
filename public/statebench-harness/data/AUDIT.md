# Integrity audit

- 72 unique completed case-method records: two models × four levels × three lengths × three methods.
- All 12 paired task JSON files were byte-identical across models.
- Every stored expected answer was recomputed from the seeded generator and exact interpreter.
- Every recorded correctness flag matched prediction equality with the expected answer.
- Every model-call count and prompt/completion token total matched its full call trace.
- Zero transport/context errors; invalid model output was scored incorrect.
- 171 actual model calls; 55,648 input tokens; 4,308 output tokens.
- Generic-grammar interrupted attempt excluded. CPU replay controls and tool-only upper bounds excluded from actual-model charts.
