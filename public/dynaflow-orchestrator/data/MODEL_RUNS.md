# Reproduce the actual CPU model experiments

These are real autoregressive model runs using public Qwen3 GGUF weights. They replace the earlier situation where only deterministic controls were available. Smaller 0.6B and 1.7B Q4_K_M models are CPU substitutes for the 4B/8B Q4 local GPU targets; they are not the research papers' backbones. The build VM has no GPU, about 10GB RAM and a two-core CPU quota. No paid model API is used.

## Install and download

Run from this standalone repository root with Python 3.12 (the measured runtime):

```sh
python -m venv .venv
. .venv/bin/activate
python -m pip install --prefer-binary --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cpu -r requirements-models.txt
python -m pip install matplotlib  # needed only for measurement plots
python download_models.py
```

The two files total 1,504,114,944 bytes. Downloads are pinned to repository revisions and verified against SHA-256 digests in `model_sources.json`. Models and virtual environments are ignored by Git. Wheel availability varies by operating system and Python version; llama-cpp-python may otherwise require its documented native build toolchain. No API keys are needed for the local server.

## Start the server

In one terminal, still from this repository root:

```sh
python local_model_server.py \
  --model Qwen3-0.6B-Q4_K_M=models/Qwen3-0.6B-Q4_K_M.gguf \
  --model Qwen3-1.7B-Q4_K_M=models/Qwen3-1.7B-Q4_K_M.gguf \
  --port 8090 --context 8192 --threads 1
```

Only one model is resident at a time. Requests are serialized to keep memory bounded; model selection is by the API `model` field. The measured session used separate ports (8090 for 0.6B and 8091 for 1.7B) to allow isolated clients; using one server produces the same protocol without simultaneous model copies. Concurrent CPU jobs affect timings, so measured latency is not a hardware speed comparison.

The adapter explicitly formats Qwen3 ChatML and prefills an empty thinking block to disable thinking. llama.cpp runs on CPU (`n_gpu_layers=0`), with seed 42, 8,192-token context and one thread per server. Experiment prompts, temperature and completion budgets are recorded in each project's artifacts. Provider token counts come from llama.cpp's tokenizer, not character estimates. Prompts that exceed context plus completion budget are rejected; they are never silently truncated. JSON-format requests rely on the client's explicit JSON prompt and validation, not constrained decoding. Malformed model output is retained as a model failure. Initial experiments with three threads and a generic recursive JSON grammar stalled and were interrupted; those attempts are retained separately as runtime failures rather than cognitive failures.

This localhost-only development server supports plain text chat completions, not streaming, tool calls, authentication or production hosting. Use Ollama/llama.cpp's production tools for deployment. The CPU server intentionally does not imply GPU VRAM measurements. For an RTX 5070 Ti with 16GB, each project's README retains conservative Qwen3 4B/8B Q4 commands and modest context budgets.

## Run experiments

See [README.md](README.md) for this project’s exact commands, measurements, limitations and demo script.
