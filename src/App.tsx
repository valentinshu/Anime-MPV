import {
  MpvObservableProperty,
  MpvConfig,
  init,
  observeProperties,
  command,
  setProperty,
  getProperty
} from 'tauri-plugin-libmpv-api'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { resolveResource } from '@tauri-apps/api/path'
import "./App.css";
import { useEffect, useState } from 'react';
import { 
  fullscreenOnIcon,
  fullscreenOfIcon,
  playIcon,
  pauseIcon,
  shadersSwitchIcon
 } from './assets/icons/icons';
 
// Properties to observe
// Tip: The optional third element, 'none', signals to TypeScript that the property's value may be null 
// (e.g., when a file is not loaded), ensuring type safety in the callback function.
const OBSERVED_PROPERTIES = [
  ['pause', 'flag'],
  ['time-pos', 'double', 'none'],
  ['duration', 'double', 'none'],
  ['filename', 'string', 'none'],
] as const satisfies MpvObservableProperty[]

// mpv configuration
const mpvConfig: MpvConfig = {
  initialOptions: {
    'vo': 'gpu-next',
    'hwdec': 'auto-safe',
    'keep-open': 'yes',
    'force-window': 'yes',
  },
  observedProperties: OBSERVED_PROPERTIES,
}
// path shaders
const shaderDir = (await resolveResource('shaders')).replace(/\\/g, '/')

const enableAnime4K = async () => {
  await setProperty('glsl-shaders', [
    `${shaderDir}/Anime4K_Clamp_Highlights.glsl`,
    `${shaderDir}/Anime4K_Restore_CNN_VL.glsl`,
    `${shaderDir}/Anime4K_Upscale_CNN_x2_VL.glsl`,
    `${shaderDir}/Anime4K_Restore_CNN_M.glsl`,
    `${shaderDir}/Anime4K_AutoDownscalePre_x2.glsl`,
    `${shaderDir}/Anime4K_AutoDownscalePre_x4.glsl`,
    `${shaderDir}/Anime4K_Upscale_CNN_x2_M.glsl`,
  ].join(';'))
  const glslShadersModified = await getProperty('glsl-shaders', 'string')
console.log('Current gls shaders is:', glslShadersModified)
}

const disableAnime4K= async () => await setProperty('glsl-shaders', '')

// Initialize mpv
try {
  await init(mpvConfig)
  console.log('mpv initialization completed successfully!')
} catch (error) {
  console.error('mpv initialization failed:', error)
}


// Load and play a file
await command('loadfile', ['C:\\Users\\Valentin\\Downloads\\video.mp4'])

    // Observe properties
    /*
const unlisten = await observeProperties(
  OBSERVED_PROPERTIES,
  ({ name, data }) => {
    switch (name) {
      case 'pause':
        // data type: boolean
        console.log('Playback paused state:', data)
        break
      case 'time-pos':
        // data type: number | null
        console.log('Current time position:', data)
        break
      case 'duration':
        // data type: number | null
        console.log('Duration:', data)
        break
      case 'filename':
        // data type: string | null
        console.log('Current playing file:', data)
        break
    }
  })
console.log(`Observed properties: ${OBSERVED_PROPERTIES[0][0]}`)
*/

// Set property
await setProperty('volume', 75)
const pausePlay = async (currentPauseState: boolean) => await setProperty('pause', !currentPauseState)
await setProperty('fullscreen', 'yes')
// Get property
const volume = await getProperty('volume', 'int64')
console.log('Current volume is:', volume)
const glslShaders = await getProperty('glsl-shaders', 'string')
console.log('Current gls shaders is:', glslShaders)
// const fullscreen = await getProperty('fullscreen', 'string')
// console.log('Current fullscreen is:', fullscreen)
// Clean up when done
// unlisten()
// await destroy()

const toggleFullscreen = async () => {
  const win = getCurrentWindow()
  const isFull = await win.isFullscreen()
  await win.setFullscreen(!isFull)
}

function App() {

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pauseState, setPauseState] = useState(false);

  const HandleSetTime = async (time: number) => await setProperty('time-pos', time)
  

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    console.log("Efecto ejecutado");
    async function setup() {
      unlisten = await observeProperties(
        OBSERVED_PROPERTIES,
        ({ name, data }) => {
          switch (name) {
            case "pause":
              setPauseState(data ?? false)
              break;

            case "time-pos":
              setCurrentTime(data ?? 0);
              break;

            case "duration":
              setDuration(data ?? 0);
              break;
          }
        }
      );
      try {
        const dur = await getProperty('duration', 'double');
        if (dur) setDuration(dur);
      } catch (_) {
        
      }
      
    }

    setup();

    return () => {
      unlisten?.();
    };
  }, []);

  

  return (
    <main className="container">
      <button onClick={() => pausePlay(pauseState)}><img src={playIcon} alt="Play" width={25}
    height={25} /></button>
      <button onClick={() => toggleFullscreen()}>fullscreen</button>
      <button onClick={() => enableAnime4K()}>ShadersOn</button>
      <button onClick={() => disableAnime4K()}>ShadersOf</button>
      <input type="range" min="0" max={duration} value={currentTime} className="slider" onChange={
        (e) => {
          const selectedTime = Number(e.target.value);
          HandleSetTime(selectedTime)
        }} />
    </main>
  );
}

export default App;
