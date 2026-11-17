# DynaFlow-style executable orchestrator

**Hosted demo:** https://veermshah.github.io/dynaflow-orchestrator/

The hosted site is published from the account’s existing GitHub Pages deployment. It displays recorded model measurements; run the CLI for new experiments. The `docs/` folder can also be published from this standalone repository or a fork.

A working same-model comparison of solo reasoning, a fixed planner → solver → reviewer pipeline, and a lead model that emits a per-task Python coordination program. Generated workflows support concurrent independent solvers, verification and aggregation; all handoffs include the original task and complete previous outputs. A strict AST interpreter runs the allowed workflow calls without executing arbitrary Python.

The completion pass uses **real Qwen3-0.6B Q4_K_M CPU inference**, substituting for the paper's trained 27B backbone. Bundled public benchmark records comprise six AIME 2024 and six HotpotQA distractor-validation questions. This is a small prompt-based reproduction of executable orchestration, not a reproduction of the trained paper system or its full benchmark score.

## GitHub Pages recorded-results explorer

The static [docs/index.html](docs/index.html) app lets visitors switch between the **recorded public subset** and **separate recorded calibration**, compare every arm's actual tokens per solved task, and inspect every saved task, emitted workflow, full-context handoff, model response and finish reason. It never runs a model, executes a workflow, reads an API key or presents saved output as live inference. Invalid model-generated plans and infrastructure/provider failures are separate. Raw source records, initial scoring snapshots, data/model provenance and SHA-256 hashes are downloadable.

Build and preview from this standalone repository root:

```bash
python build_pages.py
python -m http.server 8080 --bind 127.0.0.1 --directory docs
```

Open `http://127.0.0.1:8080/`. The build uses **only Python's standard library**, makes no network or inference calls, and copies the finalized measured records byte-for-byte. `pages/` contains editable HTML/CSS/JavaScript source; `docs/` is the complete generated publish directory, including `.nojekyll`. All runtime assets are local relative paths, so the site also works under a project prefix such as `/dynaflow-orchestrator/`. Use HTTP rather than opening `file://` because browsers restrict JSON fetching from local files. There is no server-side/API component or paid dependency for the static explorer.

For GitHub Pages, after the repository and files are available on GitHub:

1. Include the generated `docs/` folder on **main**.
2. Open **Settings → Pages → Build and deployment**.
3. Select **Deploy from a branch**, branch **main**, folder **/docs**, then save.
4. Open the Pages URL that GitHub reports. A repository/project site normally uses `https://OWNER.github.io/REPOSITORY/`; substitute the actual owner/repository, not a fabricated deployment URL.

The files here are ready for that configuration; generating them does not create a repository, push changes, enable Pages or establish a public deployment. Regenerate `docs/` whenever measured source records, documentation or templates change. A repeat build with unchanged inputs produces identical files; `docs/data/manifest.json` records the exact source bytes and hashes. Use `python build_pages.py --output /tmp/dynaflow-pages` for an isolated build.

Optional browser verification (development-only dependencies, not required by visitors/build): install Playwright and its Chromium browser, or use a system `chromium`, then run `python smoke_pages.py`. The test hosts an isolated copy under `/dynaflow-orchestrator/`, verifies local HTTP assets, official/calibration values and budgets, selectors and full-context trace inspection, checks mobile page overflow, and rejects JavaScript errors or external runtime requests. The build-session test passed on desktop and a 390px mobile viewport. Screenshots go to ignored `.pages-preview/`. No LLM/server inference is invoked by this test.

## Setup and quick smoke test

Python 3.10+; the harness itself uses the standard library, with no pip requirements. From the repository root:

```bash
# Run from this repository root
python orchestrator.py --backend surrogate --output results-surrogate
python -m unittest -q
```

The explicit `surrogate` backend is a deterministic arithmetic/graph engine, used only for smoke tests on `tasks.json`. Its character-count/4 token proxies are labeled; it does not stand in for real-model benchmark results. There is no silent fallback from real models. The real dataset is `benchmark_tasks.json`; see [DATA.md](DATA.md) and `DATA_PROVENANCE.json` for exact source URLs, IDs, transformations and caveats. All input data is bundled and works offline.

## Reproduce the real CPU experiment

Start an OpenAI-compatible llama.cpp server with the Qwen3-0.6B Q4_K_M GGUF model, 8192 context and Qwen3 thinking disabled in its chat template. Model installation and inference runtime are separate dependencies; the harness only requires HTTP. In the build session the coordinator supplies `http://127.0.0.1:8090/v1`, alias `Qwen3-0.6B-Q4_K_M`.

```bash
OPENAI_BASE_URL=http://127.0.0.1:8090/v1 python orchestrator.py \
  --backend openai --model Qwen3-0.6B-Q4_K_M \
  --tasks benchmark_tasks.json --input-per-million 0 --output-per-million 0 \
  --max-tokens 256 --plan-max-tokens 256 --output results-qwen3-cpu
```

Runtime installation/server launch instructions are in [MODEL_RUNS.md](MODEL_RUNS.md). Exact pinned weight revision, SHA-256, runtime and prompt settings are recorded in `RUN_METADATA.json`; the source model is `unsloth/Qwen3-0.6B-GGUF`, file `Qwen3-0.6B-Q4_K_M.gguf`, SHA-256 `ac2d97712095a558e31573f62f466a3f9d93990898b0ec79d7c974c1780d524a`. Weights are downloaded separately and are not bundled.

No API key is needed for loopback HTTP. The same model, temperature zero, and solver completion cap are used in all arms; workflow planning has a separately recorded cap. Intermediate planners, solvers and verifiers give concrete reasoning or evidence. Final reviewer/aggregator outputs use an explicit `FINAL:` marker. Planning is genuine generated source, not selected from a fixed template; invalid programs fail visibly without hidden repair/retries. Full raw outputs and provider finish reasons distinguish truncation from completed outputs. `partial.json` checkpoints completed tasks during longer CPU runs.

Real token accounting requires provider-reported `prompt_tokens` and `completion_tokens`; missing usage is an error. Zero dollars records **local API fees only**, excluding hardware, energy and labor. Token-per-solved, wall-clock latency and total calls remain informative when all API fees are zero. A failed request may have unknown provider-side billing and is marked as an execution error, not evidence of a reasoning failure.

## Results and claim comparison

The real run writes `results-qwen3-cpu/RESULTS.md` and `results-qwen3-cpu/results.json`. The latter contains per-call prompts, unabridged outputs, workflow source, provider token counts, finish reasons, latency, exact answers and error details. `python regrade.py results-qwen3-cpu/results.json --tasks benchmark_tasks.json` regenerates the detailed report from saved responses without inference, preserving the initial derived scores. The uniform scorer accepts explicit XML answer wrappers because this model often uses them despite the requested `FINAL:` format. Invalid plans are reported separately from infrastructure/provider errors, and their emitted tokens remain charged. Results are not inferred from the deterministic smoke run. The completed official-subset run used **256 tokens per solver call and 256 per workflow-design call**, temperature zero, and the same frozen model across all three arms:

| Public subset | Arm | Correct | Invalid plans | Total measured tokens | Tokens / solved | Local API fees / solved |
|---|---|---:|---:|---:|---:|---:|
| AIME 2024 | Solo | 0/6 | 0 | 1,676 | undefined | undefined |
| AIME 2024 | Fixed pipeline | 0/6 | 0 | 9,481 | undefined | undefined |
| AIME 2024 | Generated program | 0/6 | 0 | 7,660 | undefined | undefined |
| HotpotQA | Solo | 0/6 | 0 | 9,612 | undefined | undefined |
| HotpotQA | Fixed pipeline | 1/6 | 0 | 29,744 | 29,744.0 | $0 |
| HotpotQA | Generated program | 0/6 | 3 | 26,601 | undefined | undefined |

All **87 model calls completed successfully at the provider level**, consuming **84,774 actual tokens**, with total local API fees **$0**. The generated orchestrator emitted invalid plans on three HotpotQA tasks; those count as model/orchestration failures and incorrect answers, with planning tokens charged. Six fixed-pipeline AIME calls hit the completion cap; raw finish reasons remain available. A cost-per-solved denominator of zero is **undefined**, not free or a winning result. The fixed pipeline alone solved one official-subset task; neither solo nor generated orchestration establishes a finite cost-per-solved comparison here. The separate accessible calibration below avoids this floor without replacing the official results.

The original scorer rejected explicit XML answer wrappers; applying the same label-independent wrapper parser to **all** saved responses changed exactly one result: HotpotQA's fixed-pipeline answer `<answer>Yes</answer>` matches `yes`. No model was rerun, no label changed, and the initial derived scores are preserved as `results.before-xml-answer-normalization.json`. The current harness already accepts these wrappers. The detailed final table is [results-qwen3-cpu/RESULTS.md](results-qwen3-cpu/RESULTS.md). The first pending CPU attempt was interrupted when a shared server stalled behind another project's JSON grammar generation: `results-qwen3-cpu-interrupted/ATTEMPT.json` preserves the event and raw technical errors. No model call completed in that attempt, so its 36 error rows establish no accuracy or token-cost result. A fresh inference attempt is recorded separately.

[DynaFlow, arXiv:2610.34467](https://arxiv.org/abs/2610.34467), Table 1, reports trained Qwen3.5-27B **Forced** collaboration at 100% on AIME 2024, 2025 and 2026, with 88.08% overall versus the strongest baseline's 77.18%. The retrieved table's solo CoT AIME 2026 result is **86.67%**, correcting the approximately 52% supplied in the brief. These remain paper claims, not independent confirmation.

This project skips QLoRA, uses a small untrained-for-orchestration model, uses constrained Python instead of general JavaScript, and evaluates twelve preselected public records instead of the paper's full six benchmarks. Results cannot establish or refute the original 27B performance claims. Public examples may occur in training data. This tiny sample has no generalization claim or confidence interval. A loss against solo is reported as such; the experiment does not require winning.

## Separate real-model calibration on accessible tasks

The official AIME subset reached a zero-correct floor, so the coordinator requested a **separate** run on the twelve original toy tasks. This uses the same real frozen Qwen3-0.6B Q4_K_M weights, with a smaller **128-token solver cap and 192-token workflow cap**. It is exploratory calibration, not a replacement benchmark or a change to official-task denominators. The pre-existing complete toy set was used, without selecting questions by model success. It ran on a spare CPU server at port 8091; a single-server sequential reproduction may use port 8090 with the same alias:

```bash
OPENAI_BASE_URL=http://127.0.0.1:8090/v1 python orchestrator.py \
  --backend openai --model Qwen3-0.6B-Q4_K_M --tasks tasks.json \
  --input-per-million 0 --output-per-million 0 --max-tokens 128 --plan-max-tokens 192 \
  --timeout 600 --output results-qwen3-toy
python regrade.py results-qwen3-toy/results.json --tasks tasks.json
```

| Original toy family | Arm | Correct | Invalid plans | Total measured tokens | Tokens / solved | Local API fees / solved |
|---|---|---:|---:|---:|---:|---:|
| Math | Solo | 1/6 | 0 | 1,039 | 1,039.0 | $0 |
| Math | Fixed pipeline | 1/6 | 0 | 4,875 | 4,875.0 | $0 |
| Math | Generated program | 1/6 | 2 | 3,257 | 3,257.0 | $0 |
| Multi-hop | Solo | 4/6 | 0 | 1,168 | 292.0 | $0 |
| Multi-hop | Fixed pipeline | 4/6 | 0 | 4,242 | 1,060.5 | $0 |
| Multi-hop | Generated program | 1/6 | 4 | 2,915 | 2,915.0 | $0 |

**Generated orchestration loses in this calibration:** it uses 3.13× the solo tokens per correct math answer and 9.98× the solo tokens per correct multi-hop answer. It also fails to emit a valid workflow on six of twelve tasks. These are model/orchestration failures, counted incorrect, with their planning tokens charged; provider errors are zero. The fixed pipeline adds cost without improving accuracy here. All local API fees total $0; hardware/electricity are excluded. Dollar-fee-per-solved therefore ties and cannot demonstrate an economic advantage; token-per-solved exposes the additional inference work.

The real calibration artifacts are [results-qwen3-toy/RESULTS.md](results-qwen3-toy/RESULTS.md) and `results-qwen3-toy/results.json`; every output and actual provider count is retained. One solo call and six fixed-pipeline calls hit the completion cap. The generated arm had no length-capped call in this cohort. Shared-server scheduling makes wall times operational observations, not isolated throughput comparisons. No model performance result is taken from the deterministic surrogate.

## RTX 5070 Ti, 16GB

The CPU model is a build-environment substitution. For local deployment use **Qwen3 4B Q4_K_M**, or 8B Q4_K_M if measured VRAM headroom permits, with 8192 context as the initial target. No 24GB-card or 27B assumption is used. With Ollama installed:

```bash
ollama pull qwen3:4b
python orchestrator.py --backend ollama --model qwen3:4b --context 8192 \
  --tasks benchmark_tasks.json --input-per-million 0 --output-per-million 0 \
  --output results-qwen3-4b
```

Check `ollama show qwen3:4b` for the downloaded quantization and measure peak GPU memory locally. Four-bit 4B/8B weights should leave room on 16GB for runtime/KV cache, but this CPU build does not measure GPU VRAM. Parallel inference may increase KV usage or serialize at the server. The 4B default is conservative. Ollama's `think: false` and `/no_think` request concise outputs; server compatibility depends on version. Input prompts exceeding server context produce errors; the harness does not silently truncate full-context handoffs.

## Optional paid API

Variables are listed in `.env.example`; export them yourself because `.env` is not automatically loaded. API keys are never embedded in source. Any compatible remote chat-completions provider can be used; **API usage may cost money**. Set current provider prices per million tokens explicitly:

```bash
export OPENAI_API_KEY='your-key'
export OPENAI_BASE_URL='https://api.openai.com/v1'
export MODEL='your-available-model'
python orchestrator.py --backend openai --model "$MODEL" --tasks benchmark_tasks.json \
  --input-per-million 0.15 --output-per-million 0.60 --output results-api
```

The numeric prices above are illustrative inputs, not current-price assertions. Both rates must be supplied together, or dollars remain unknown. No key is required for loopback; remote providers require `OPENAI_API_KEY`. Keys are read only from environment variables. Raw traces contain your task content, so protect them when benchmarking private data.

## Runtime and grading details

Generated programs allow at most six assignments to fresh variables and only `solve`, `parallel`, `verify`, `aggregate` calls. A nine-call total budget includes the workflow-design request. Arbitrary imports, attributes, loops, filesystem/shell access and arbitrary expression execution are rejected. Explicit argument values are included at verification/aggregation boundaries along with the full preceding history. Concurrent solvers receive identical full prior context. A `FINAL:` answer marker, explicit XML `<answer>...</answer>` wrapper, or mathematical boxed answer is extracted without consulting labels; otherwise verbose unmarked responses may fail exact-match grading. HotpotQA uses article/punctuation/whitespace normalization; AIME accepts integer-equivalent leading zeroes. No answer labels, reference solutions or supporting-fact annotations enter prompts.

Pass `--tasks custom.json` with fields `id`, `benchmark`, `question`, `answer` and optional `facts` for custom runs. Transport/provider failures stop immediately with exit code 2 and preserve `partial.json`; use `--continue-on-provider-error` only if you deliberately want to proceed. Model-generated invalid workflow programs remain per-task errors and do not stop other tasks. Execution errors are counted separately from successful wrong answers. Inspect errors and finish reasons before interpreting a score.

## 60-second demo

1. (0–15s) Run `python orchestrator.py --output /tmp/dynaflow-demo` for the fast CPU smoke test.
2. (15–30s) Open the committed real-model results table and compare solo/fixed/generated token cost per correct answer.
3. (30–45s) Open a real run's `results.json`, search `workflow`, and inspect the emitted Python, full handoffs and verifier reasoning.
4. (45–60s) Run `python -m unittest -q`; show that executable escapes are rejected and actual provider usage is required. Use the Ollama command above for a larger 16GB-compatible local model.
