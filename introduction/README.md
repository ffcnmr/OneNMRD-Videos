# OneNMRD Interface introduction

[`onenmrd-introduction.mp4`](https://github.com/ffcnmr/OneNMRD-Videos/releases/latest/download/onenmrd-introduction.mp4) is a 5 minute 30 second, 1920×1080 introduction with English narration and an embedded English subtitle track (soft subtitles; turn them on in the player). [`onenmrd-introduction.srt`](onenmrd-introduction.srt) holds the same subtitles as a separate file, and [`onenmrd-introduction-script.txt`](onenmrd-introduction-script.txt) holds the full script.

It covers:

- the consoles and magnets: FFC4 (Magritek Kea with Prospa) and the Resonance Systems ultraRelax8 (uSpin32), with its FFC device levels V1 and V2 from the field calibration;
- the field-cycling sequences #1–#8, the fixed-field T1 inversion and saturation recovery (#9, #10), RF tuning, the timing diagrams and the plan;
- live acquisition: every scan, its spectrum, the average, M ± σ, noise and S/N, M(τ) building up and the live fit of each finished field, with Results following the run;
- the noise analysis choices (phase treatment, scan-scatter estimator, the previous Prospa analysis for comparison), a Gaussian filter preview, and the ultraRelax8's noise and health check;
- magnet diagnostics (preliminary; the planned read-only field monitor, played by the simulator): the live Hall voltage with the TTL pulses, the last field-down and field-up transitions, their measurements, drift, temperatures and rails, and the recent edges on the monitor's own clock;
- Fit in OFE (OFE-Go) and Open in OFE-GUI;
- the Terminal pane with its agent buttons and the AGENTS.md OneNMRD writes for them.

**The published November 12 cut** uses OneNMRD v0.6.1 and OFE-Go/OFE-GUI 0.5.14.

**The v0.10.0 refresh is in preparation:** its current script and captures in this branch retain the original narrated introduction, slides, camera movements, highlights and end card. New OneNMRD screens use the released v0.10.0 binary and Dim theme; the OFE scenes use OFE-Go 0.5.14 and OFE-GUI 0.5.15. The revised narration adds complete setup selection, magnet-defined diagnostic groups, actual row-start supply snapshots, explicitly unavailable PID gains, and direct versus vendor-console diagnostic routes. Hardware support is described as pending qualification. Narration is slightly slower, with longer sentence pauses for non-native English listeners.

The final narration, synchronized subtitles and MP4 have **not yet been rendered/published**: downloading the original Piper Alba voice model is blocked by the capture host's network approval policy for `huggingface.co:443`. The existing published introduction remains available unchanged until the refreshed cut is verified.

**Every new screen comes from an isolated built-in simulator.** No hardware was used, no vendor program was run, and no coding agent was started. The acquisition uses the previous Prospa analysis so its original comparison with Prospa T1 remains visible; the Gaussian filter preview is 20 kHz. The simulator does not qualify any console. The ultraRelax8 check values are simulated too.

## Building

Needs Python 3 with `numpy`, `Pillow` and `piper-tts`, ffmpeg with libx264, and Node.js for the slides (`npm install` at the top of this repository, which installs `playwright-core`; set `CHROME` to a Chromium binary if Playwright has none of its own).

```sh
npm install
kit/get-voice.sh
introduction/build/make.sh
```

`make.sh` runs the shared build in [`kit/`](../kit) on this folder: it renders the slides, synthesizes the narration sentence by sentence (`narration.py` holds each sentence's caption text, spoken text, camera framing and highlight), renders the frames, normalizes the narration to −16 LUFS with a −1.5 dBTP ceiling, and writes `../onenmrd-introduction.mp4` with its embedded subtitles, plus the `.srt` and the script. `REUSE_AUDIO=1` keeps the audio of every unchanged sentence from the previous build in `build/out/`. The last 4 s are `kit/end-card.png`, a dark version of OneNMRD's `docs/social-preview.svg` (`kit/end-card.svg`).

`build/shots/` holds the nine screens, captured at 3840×2160. `build/capture/shot.cjs` captured them from a running onenmrd-gui: `node shot.cjs OUT.png layouts/<scene>.json steps/<scene>.js`, with `GUI` the link onenmrd-gui prints at start (with its key), `PROFILE` a Chromium profile folder and `CHROME` if needed. `layouts/` holds each scene's pane layout and `steps/` what was done before the screenshot (`run.js` runs the plan and screenshots it every 4 s; 30-live.png is its seventh). The scenes need, in this order: `sequences`, `run`, `fit-ofe` (40-results), `terminal` (50), `open-ofe` (60, from OFE-GUI's tab), `noise` (35), `uspin` (10, with `IMPORT=1 CHECK1=… CHECK2=…` the first time: two logs from `fake-hardware -checklog`), `diagnostics` (45, with fake-hardware `-monitor` and the GUI's monitor enabled; `SCROLL=1 SKIPRUN=1` for 46). The config used:

```json
{
  "listen": "127.0.0.1:8090",
  "console": "kea",
  "simulator": true,
  "dataDir": "results",
  "ofe": {"command": ["/opt/onefite-go/bin/onefite"], "gui": "http://127.0.0.1:9143", "guiPaths": "same"},
  "terminal": {"enable": true, "shell": ["bash", "-l"], "agents": [{"name": "Claude", "command": "claude"}, {"name": "Codex", "command": "codex"}]}
}
```

next to `onenmrd-gui`, `fake-hardware`, `consoles/` and `demo/` (both from the OneNMRD repository's `go-gui/testdata/demo`).

## Voice credit

Narration was generated with Piper's `en_GB-alba-medium` voice. Its model card names the University of Edinburgh dataset at <https://datashare.ed.ac.uk/handle/10283/3270>, licensed under CC BY 4.0, and says the model was fine-tuned from the U.S. English Lessac voice. See the [Alba voice model card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/alba/medium/MODEL_CARD) and the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

## Refreshing the v0.10.0 captures

`build/capture/refresh-v0100.cjs` reproduces the new screens from the downloaded Linux/amd64 release, in a fresh private capture directory. It checks the released version and Dim theme, runs a four-field plan through the actual Run/confirmation controls, imports two emulator check logs, performs a real OFE fit and opens OFE-GUI, then captures the terminal's read-only API demonstration. `build/capture/shot-boxes.json` records the measured plot/pane bounds.

```sh
NMR_RELEASE_BIN=/path/to/extracted/onenmrd-gui-v0.10.0-linux-amd64 \
NMR_CAPTURE_WORK=/path/to/new/private/capture-folder \
NMR_OFE_COMMAND=/path/to/onefite \
NMR_OFE_GUI=http://127.0.0.1:19143 \
OFE_PATH=/path/to/engine \
CHROME=/path/to/chromium \
node introduction/build/capture/refresh-v0100.cjs
```

The OFE engine and OFE-GUI must already be available. Keep the capture work directory private: its log contains a temporary owner credential. Only the selected screenshots and caption/narration/build sources belong in this video repository. Public application source and macro files are not added.
