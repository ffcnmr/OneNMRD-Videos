# OneNMRD-Videos

Videos about [OneNMRD Interface](https://github.com/ffcnmr/OneNMRD-go-gui), the browser GUI for NMR relaxometry (NMRD profiles) on conventional and fast-field-cycling consoles.

The MP4 files are **release assets**, not files in this repository, so that cloning it stays small. Each release carries every current video; the links below always point to the newest release.

| Video | Length | Download | Captions and script |
| --- | --- | --- | --- |
| OneNMRD Interface introduction (v0.10.0) | 6:19 | [onenmrd-introduction.mp4](https://github.com/ffcnmr/OneNMRD-Videos/releases/latest/download/onenmrd-introduction.mp4) | [captions](introduction/onenmrd-introduction.srt), [script](introduction/onenmrd-introduction-script.txt), [about](introduction/README.md) |

Every MP4 also has its subtitles as an embedded track; turn them on in the player.

## Building

Each video's folder has a `build/` folder with everything needed to rebuild it: the narration script, the slides, the captured screens and the capture scripts. The build itself is shared, in [`kit/`](kit), a copy of [OneFit-Engine-Videos](https://github.com/fitteia/OneFit-Engine-Videos)' kit: `npm install` and `kit/get-voice.sh` once, then a video's `build/make.sh`. See [introduction/README.md](introduction/README.md#building).

## Releasing a new cut

Build it, commit the changed captions, script and sources, then attach the MP4 to a new release (from the repository's own clone):

```sh
gh release create videos-YYYY-MM-DD introduction/onenmrd-introduction.mp4 --title "Videos YYYY-MM-DD"
```

A new release must attach every current video, since `releases/latest` is what the links use.

## License

The build scripts and texts are distributed under the Artistic License 2.0 (see [LICENSE](LICENSE)). The narration voice has its own license; see each video's README for the credit.
