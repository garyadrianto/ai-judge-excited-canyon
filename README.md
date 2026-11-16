# AI Judge — Excited Canyon

A deterministic entry for the make.fun competition [ai-excited-01](https://make.fun/c/ai-excited-01). `main.ts` is a dependency-free Node 22 program that copies the canyon artwork shipped in this repository (`entry.png`) into the competition output directory as `entry.png`, using `MAKEFUN_OUTPUT_DIR` when it is set and `/output` otherwise. It creates the output directory, copies the bytes unchanged, verifies the result is a non-empty PNG, and exits 0, so two runs always write identical bytes.

Run it from a checkout with:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

[![ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/c/ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/garyadrianto/ai-judge-excited-canyon/rank.svg)](https://make.fun/c/ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/garyadrianto/ai-judge-excited-canyon/reward.svg)](https://make.fun/c/ai-excited-01)
