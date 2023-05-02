import { useRef, useEffect } from 'react'

const RENDER_WIDTH = 256
const RENDER_HEIGHT = 240
const RENDER_SCALE = 3

interface Color {
  r: number
  g: number
  b: number
  a: number
}

function renderScreenBuffer(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  screenBuffer: Uint8Array,
  palette: Color[]
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const bufferWidth = 160
  const bufferHeight = 120
  const imageData = ctx.createImageData(bufferWidth, bufferHeight)

  for (let y = 0; y < bufferHeight; y++) {
    for (let x = 0; x < bufferWidth; x++) {
      const bufferIndex = y * bufferWidth + x
      const colorValue = screenBuffer[bufferIndex]

      // Convert colorValue to RGBA format (assuming an 8-bit palette)
      const rgbaColor = palette[colorValue]

      // Set the pixel color in the ImageData
      const imageDataIndex = bufferIndex * 4
      imageData.data[imageDataIndex] = rgbaColor.r
      imageData.data[imageDataIndex + 1] = rgbaColor.g
      imageData.data[imageDataIndex + 2] = rgbaColor.b
      imageData.data[imageDataIndex + 3] = rgbaColor.a
    }
  }

  // Update the entire screen buffer in a single draw call
  ctx.putImageData(imageData, 0, 0)
}

function renderAndScale(
  canvas: HTMLCanvasElement,
  offscreenCanvas: OffscreenCanvas,
  screenBuffer: Uint8Array,
  palette: Color[],
  scaleFactor: number
) {
  renderScreenBuffer(offscreenCanvas, screenBuffer, palette)
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.imageSmoothingEnabled = false // Set to true for bilinear scaling.
  const { width, height } = calcScaledRender(
    scaleFactor,
    canvas.width,
    canvas.height
  )
  ctx.drawImage(offscreenCanvas, 0, 0, width, height)
}

const calcScaledRender = (scale: number, width: number, height: number) => ({
  width: width * scale,
  height: height * scale
})

export default function Display() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenCanvasRef = useRef(new OffscreenCanvas(256, 240))

  useEffect(() => {
    const canvas = canvasRef.current
    const offscreenCanvas = offscreenCanvasRef.current

    // Define your screen buffer and palette here
    const screenBuffer = new Uint8Array(RENDER_WIDTH * RENDER_HEIGHT)
    const palette: Color[] = [{ r: 255, g: 255, b: 255, a: 255 }]

    if (canvas && offscreenCanvas) {
      // Render and scale the offscreen canvas to the visible canvas.
      renderAndScale(
        canvas,
        offscreenCanvas,
        screenBuffer,
        palette,
        RENDER_SCALE
      )

      // Set up an animation loop or interval to consistently update the display.
      const animationLoop = () => {
        renderAndScale(
          canvas,
          offscreenCanvas,
          screenBuffer,
          palette,
          RENDER_SCALE
        )

        // Draw "Hello World" text in the center of the canvas
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        ctx.fillStyle = 'black'
        ctx.font = `${10 * RENDER_SCALE}px monospace`
        const text = 'Hello, World!'
        const textWidth = ctx.measureText(text).width
        const x = (width - textWidth) / 2
        const y = height / 2
        ctx.fillText(text, x, y)

        requestAnimationFrame(animationLoop)
      }

      requestAnimationFrame(animationLoop)
    }
  }, [])

  const { width, height } = calcScaledRender(
    RENDER_SCALE,
    RENDER_WIDTH,
    RENDER_HEIGHT
  )

  return <canvas ref={canvasRef} width={width} height={height} />
}
