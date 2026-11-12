# OneNMRD Interface introduction

[`onenmrd-introduction.mp4`](https://github.com/ffcnmr/OneNMRD-Videos/releases/latest/download/onenmrd-introduction.mp4) is a 4 minute 43 second, 1920×1080 introduction with English narration and an embedded English subtitle track (soft subtitles; turn them on in the player). [`onenmrd-introduction.srt`](onenmrd-introduction.srt) holds the same subtitles as a separate file, and [`onenmrd-introduction-script.txt`](onenmrd-introduction-script.txt) holds the full script.

It covers:

- the consoles and magnets: FFC4 (Magritek Kea with Prospa) and the Resonance Systems ultraRelax8 (uSpin32), with its FFC device levels V1 and V2 from the field calibration;
- the field-cycling sequences #1–#8, the fixed-field T1 inversion and saturation recovery (#9, #10), RF tuning, the timing diagrams and the plan;
- live acquisition: every scan, its spectrum, the average, M ± σ, noise and S/N, M(τ) building up and the live fit of each finished field, with Results following the run;
- the noise analysis choices (phase treatment, scan-scatter estimator, the previous Prospa analysis for comparison), a Gaussian filter preview, and the ultraRelax8's noise and health check;
- Fit in OFE (OFE-Go) and Open in OFE-GUI;
- the Terminal pane with its agent buttons and the AGENTS.md OneNMRD writes for them.

**Every screen comes from OneNMRD's built-in simulator** (onenmrd-gui v0.6.1, the "Interface" header, Simulator on), run on a Linux test host with OFE-Go 0.5.14 and OFE-GUI 0.5.14 there. No hardware was used; the simulator does not qualify any console. The ultraRelax8's check values are simulated too. The narration describes the agent buttons as starting a separately installed agent; none was started for the video.

## Building

Needs Python 3 with `numpy`, `Pillow` and `piper-tts`, ffmpeg with libx264, and Node.js for the slides (`npm install` at the top of this repository, which installs `playwright-core`; set `CHROME` to a Chromium binary if Playwright has none of its own).

```sh
npm install
kit/get-voice.sh
introduction/build/make.sh
```

`make.sh` runs the shared build in [`kit/`](../kit) on this folder: it renders the slides, synthesizes the narration sentence by sentence (`narration.py` holds each sentence's caption text, spoken text, camera framing and highlight), renders the frames, normalizes the narration to −16 LUFS with a −1.5 dBTP ceiling, and writes `../onenmrd-introduction.mp4` with its embedded subtitles, plus the `.srt` and the script. `REUSE_AUDIO=1` keeps the audio of every unchanged sentence from the previous build in `build/out/`. The last 4 s are `kit/end-card.png`, a dark version of OneNMRD's `docs/social-preview.svg` (`kit/end-card.svg`).

`build/shots/` holds the seven screens, captured at 3840×2160. `build/capture/shot.cjs` captured them from a running onenmrd-gui: `node shot.cjs OUT.png layouts/<scene>.json steps/<scene>.js`, with `GUI` the link onenmrd-gui prints at start (with its key), `PROFILE` a Chromium profile folder and `CHROME` if needed. `layouts/` holds each scene's pane layout and `steps/` what was done before the screenshot (`run.js` runs the plan and screenshots it every 4 s; 30-live.png is its seventh). The scenes need, in this order: `sequences`, `run`, `fit-ofe` (40-results), `terminal` (50), `open-ofe` (60, from OFE-GUI's tab), `noise` (35), `uspin` (10, with `IMPORT=1 CHECK1=… CHECK2=…` the first time: two logs from `fake-hardware -checklog`). The config used:

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
