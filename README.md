# AnimeMPV

A lightweight desktop media player built with [Tauri](https://tauri.app/) and [React](https://react.dev/), powered by the real [mpv](https://mpv.io/) engine via [tauri-plugin-libmpv](https://github.com/nini22P/tauri-plugin-libmpv). Designed specifically for anime, with built-in support for [Anime4K](https://github.com/bloc97/Anime4K) GLSL shaders.

> **Windows only** — macOS and Linux are not currently supported.

---

## Screenshots

<!-- Screenshot: Main player window with video loaded and interpolation off/on -->
![Player]([screenshots/player.png](https://github.com/valentinshu/Anime-MPV/issues/1#issue-4657971289))

<!-- Screenshot: Anime4K shaders active, visual quality comparison -->
![Anime4K]([screenshots/anime4k.png](https://github.com/valentinshu/Anime-MPV/issues/2#issue-4657973007))

---

## Features

- **Native mpv engine** — video is rendered directly by `libmpv-2.dll`, not a browser `<video>` element. Full GPU acceleration via `vo=gpu-next`.
- **Anime4K shaders** — one-click toggle for the Mode A+A (HQ) shader pipeline, optimized for upscaling 1080p anime to 4K in real time.
- **File picker** — open any video file through a native Windows dialog.
- **Playback controls** — play, pause, seek with a progress slider.
- **Time display** — elapsed time and remaining time shown during playback.
- **Volume control** — adjustable volume with persistent state.
- **Fullscreen** — toggle fullscreen via button or keyboard shortcut.
- **Video interpolation** — smooth motion via mpv's interpolation pipeline.
- **Lightweight** — built with Tauri, the final binary is a fraction of the size of an Electron app.

---

## Anime4K Shader Pipeline

AnimeMPV uses the **Mode A+A (HQ)** preset from Anime4K v4, which applies the following shaders in order:

| Shader | Purpose |
|---|---|
| `Anime4K_Clamp_Highlights` | Prevents highlight overshoot and ringing after upscaling |
| `Anime4K_Restore_CNN_VL` | Removes compression artifacts and blur before upscaling |
| `Anime4K_Upscale_CNN_x2_VL` | First upscaling pass ×2 (very large network, high quality) |
| `Anime4K_Restore_CNN_M` | Second restoration pass after first upscale |
| `Anime4K_AutoDownscalePre_x2` | Prepares image for second upscale pass |
| `Anime4K_AutoDownscalePre_x4` | Prepares image for second upscale pass |
| `Anime4K_Upscale_CNN_x2_M` | Second upscaling pass ×2 (medium network, balanced speed) |

Requires a dedicated GPU. Recommended for 1080p source content displayed on a 4K screen.

---

## Tech Stack

| Layer | Technology |
|---|---|
| App framework | [Tauri 2](https://tauri.app/) |
| Frontend | React + TypeScript + Vite |
| Video engine | [libmpv](https://mpv.io/) via [tauri-plugin-libmpv](https://github.com/nini22P/tauri-plugin-libmpv) |
| Shaders | [Anime4K v4](https://github.com/bloc97/Anime4K) (GLSL) |
| Platform | Windows 10/11 x86_64 |

---

## Requirements

- Windows 10 or 11 (x86_64)
- A dedicated GPU is strongly recommended for Anime4K shaders
- [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe) (usually already installed)
- [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (included in Windows 11, auto-installed on Windows 10)

---

## Installation

Download the latest installer from the [Releases](../../releases) page and run it.

No additional setup required — `libmpv` and all shaders are bundled with the app.

---

## Building from Source

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Rust](https://rustup.rs/) (stable toolchain)
- [Microsoft Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the "Desktop development with C++" workload

### Steps

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/AnimeMPV.git
cd AnimeMPV

# Install dependencies
npm install

# Download libmpv and wrapper DLLs
npx tauri-plugin-libmpv-api setup-lib

# Start in development mode
npm run tauri dev
```

> **Note:** In development, Tauri resolves resources from `src-tauri/target/debug/`. After running `setup-lib`, manually copy your shaders there:
> ```
> src-tauri/resources/shaders/  →  src-tauri/target/debug/shaders/
> ```

### Production build

```bash
npm run tauri build
```

The installer will be output to `src-tauri/target/release/bundle/`.

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please open an issue first for major changes to discuss what you'd like to change.

---

## Acknowledgements

- [mpv](https://mpv.io/) — the video player engine that powers this app
- [tauri-plugin-libmpv](https://github.com/nini22P/tauri-plugin-libmpv) by [nini22P](https://github.com/nini22P) — Tauri plugin for embedding libmpv (MPL-2.0)
- [Anime4K](https://github.com/bloc97/Anime4K) by [bloc97](https://github.com/bloc97) — real-time anime upscaling shaders (MIT)

---

## License

MIT © YOUR_USERNAME
