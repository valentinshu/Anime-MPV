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

// Observe properties
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
        // console.log('Current time position:', data)
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
  console.log(unlisten)
console.log(`Observed properties: ${OBSERVED_PROPERTIES[0][0]}`)
// Load and play a file
await command('loadfile', ['C:\\Users\\Valentin\\Downloads\\video.mp4'])

// Set property
await setProperty('volume', 75)
const pause = async () => await setProperty('pause', true)
const play = async () => await setProperty('pause', false)
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
  return (
    <main className="container">
      <button onClick={() => pause()}>Pause</button>
      <button onClick={() => play()}>Play</button>
      <button onClick={() => toggleFullscreen()}>fullscreen</button>
      <button onClick={() => enableAnime4K()}>ShadersOn</button>
      <button onClick={() => disableAnime4K()}>ShadersOf</button>
    </main>
  );
}

export default App;
