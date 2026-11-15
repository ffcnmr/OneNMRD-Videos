#!/bin/sh
set -e
cd "$(dirname "$0")"
mkdir -p voices
# Pin the voice and its model card/configuration for reproducible narration.
revision=6b9cfaacb4fb2e02a9621227e3c1a48bec9710c3
base=https://huggingface.co/rhasspy/piper-voices/resolve/$revision/en/en_GB/alba/medium
for f in en_GB-alba-medium.onnx en_GB-alba-medium.onnx.json MODEL_CARD; do
  [ -s "voices/$f" ] || curl -fsSL -o "voices/$f" "$base/$f"
done
ls -l voices
