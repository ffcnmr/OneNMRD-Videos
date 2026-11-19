# OneNMRD Interface introduction

[`onenmrd-introduction.mp4`](https://github.com/ffcnmr/OneNMRD-Videos/releases/latest/download/onenmrd-introduction.mp4) is a 6 minute 19 second, 1920×1080 introduction with English narration and an embedded English subtitle track (soft subtitles; turn them on in the player). [`onenmrd-introduction.srt`](onenmrd-introduction.srt) holds the same subtitles as a separate file, and [`onenmrd-introduction-script.txt`](onenmrd-introduction-script.txt) holds the full script.

It covers:

- the complete setups: **FFC + Kea**, **FFC + uSpin32**, and **Fixed field + uSpin32**; the FFC4/ultraRelax8 consoles, compatible magnets, and calibrated FFC device levels V1 and V2;
- the field-cycling sequences #1–#8, the fixed-field T1 inversion and saturation recovery (#9, #10), RF tuning, the timing diagrams and the plan;
- live acquisition: every scan, its spectrum, the average, M ± σ, noise and S/N, M(τ) building up and the live fit of each finished field, with Results following the run;
- the noise analysis choices (phase treatment, scan-scatter estimator, the previous Prospa analysis for comparison), a Gaussian filter preview, and the ultraRelax8's noise and health check;
- magnet-defined diagnostic groups, channels, units and direct/vendor-console routes; temperature trends, supply snapshots at actual plan-row starts, explicitly unavailable PID gains, live Hall/TTL plots, full-rate field transitions, measurements, drift and device-clock timestamps; fixed-field setups hide unneeded switching panels;
- Fit in OFE (OFE-Go) and Open in OFE-GUI;
- the Terminal pane with its agent buttons and the AGENTS.md OneNMRD writes for them.

**This cut updates the introduction for OneNMRD v0.12.0.** It retains the narrated tour, slides, camera movements, highlights and end card. OneNMRD screens use the released v0.12.0 binary and the Light theme (November 19: clearer than Dim on video; every framing keeps at least ¾ of the screen width in view, at most 1.33× zoom, and the highlight dims its surroundings less), with the new running-position highlights (the running Plan row with its scan k/N, frequency and τ; Row, f and scan in Live acquisition) and the Simulator's 500 ms D1 at half the earlier speed; the OFE scenes use OFE-Go 0.5.14 and OFE-GUI 0.5.15. The female British English Alba voice is slightly slower, with longer sentence pauses and the model card’s recommended noise settings. The new diagnostic routes are configuration/simulator support; native hardware drivers still require qualification.

The November 19 cut also corrects the Live sentence: the Last field fit is redone each time a new point arrives, marked partial until the field is complete. The Dim-theme v0.12.0 cut (November 18), the v0.10.0 cut (November 15) and the original November 12 cut remain in the older video releases.

**Every new screen comes from an isolated built-in simulator.** No hardware was used, no vendor program was run, and no coding agent was started. The acquisition uses the previous Prospa analysis so its original comparison with Prospa T1 remains visible; the Gaussian filter preview is 20 kHz. The simulator does not qualify any console. The ultraRelax8 check values are simulated too.

## Building

Needs Python 3 with `numpy`, `Pillow` and `piper-tts`, ffmpeg with libx264, and Node.js for the slides (`npm install` at the top of this repository, which installs `playwright-core`; set `CHROME` to a Chromium binary if Playwright has none of its own).

```sh
npm install
kit/get-voice.sh
introduction/build/make.sh
```

`make.sh` runs the shared build in [`kit/`](../kit) on this folder: it renders the slides, synthesizes the narration sentence by sentence (`narration.py` holds each sentence's caption text, spoken text, camera framing and highlight), renders the frames, normalizes the narration to −16 LUFS with a −1.5 dBTP ceiling, and writes `../onenmrd-introduction.mp4` with its embedded subtitles, plus the `.srt` and the script. `REUSE_AUDIO=1` keeps the audio of every unchanged sentence from the previous build in `build/out/`. The last 4 s are `kit/end-card.png`, a dark version of OneNMRD's `docs/social-preview.svg` (`kit/end-card.svg`).

`build/shots/` holds the eleven screens, captured at 3840×2160. The reproducible v0.12.0 capture procedure is below; the v0.10.0 script `refresh-v0100.cjs` stays for reference. The older `shot.cjs`, individual steps and layouts remain as the original capture sources; the new combined capture script updates their setup selectors, simulator configuration and diagnostics layout.

## Voice credit

Narration was generated with Piper's `en_GB-alba-medium` voice. Its model card names the University of Edinburgh dataset at <https://datashare.ed.ac.uk/handle/10283/3270>, licensed under CC BY 4.0, and says the current model was fine-tuned from the Hi-Fi TTS Cori Samuel base voice. The refresh uses the model card’s recommended noise settings for smoother delivery. The voice model, configuration and model card are pinned by the download script. See the [Alba voice model card](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/alba/medium/MODEL_CARD) and the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/).

## Refreshing the v0.12.0 captures

`build/capture/refresh-v0120.cjs` reproduces the new screens from the downloaded Linux/amd64 release, in a fresh private capture directory. It checks the released version and Dim theme, runs a four-field plan through the actual Run/confirmation controls, imports two emulator check logs, performs a real OFE fit and opens OFE-GUI, then captures the terminal's read-only API demonstration. `build/capture/shot-boxes.json` records the measured plot/pane bounds.

```sh
NMR_RELEASE_BIN=/path/to/extracted/onenmrd-gui-v0.12.0-linux-amd64 \
NMR_CAPTURE_WORK=/path/to/new/private/capture-folder \
NMR_OFE_COMMAND=/path/to/onefite \
NMR_OFE_GUI=http://127.0.0.1:19143 \
OFE_PATH=/path/to/engine \
CHROME=/path/to/chromium \
node introduction/build/capture/refresh-v0120.cjs
```

The OFE engine and OFE-GUI must already be available (here the `onefite-go_0.5.14_amd64.deb` package with `OFE_PATH=/opt/onefite-go`, and the released OFE-GUI 0.5.15). The 30-live screen is taken mid-run, on row 3 at τ 4/7. Keep the capture work directory private: its log contains a temporary owner credential. Only the selected screenshots and caption/narration/build sources belong in this video repository. Private application source and Prospa macro files are not added.

## Chapters

```text
00:00 OneNMRD Interface
00:18 Consoles and magnets
00:49 ultraRelax8
01:09 Pulse sequences
01:37 Sequences and plan
02:05 Live acquisition
02:44 Noise
03:19 Magnet diagnostics
04:30 Fit in OFE
04:55 OFE-GUI
05:07 Terminal and AI agents
05:41 Closing
```
