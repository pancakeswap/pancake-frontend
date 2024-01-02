import { useEffect, useMemo, useState } from 'react'

type Params = {
  url?: string
}

export function useImageColor({ url }: Params) {
  const [rgb, setRgb] = useState<RGB | undefined>()

  useEffect(() => {
    if (!url) {
      return
    }

    const el = document.createElement('img')
    el.setAttribute('src', url)
    el.setAttribute('crossOrigin', 'Anonymous')
    el.style.visibility = 'hidden'

    const onLoad = () => {
      setRgb(getAverageRGB(el))
      document.body.removeChild(el)
    }
    el.addEventListener('load', onLoad)

    document.body.appendChild(el)

    // eslint-disable-next-line consistent-return
    return () => {
      el.removeEventListener('load', onLoad)
      if (document.body.contains(el)) {
        document.body.removeChild(el)
      }
    }
  }, [url])

  const rgbColor = useMemo(() => rgb && `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, [rgb])
  const isDarkColor = useMemo(() => Boolean(rgb && isDark(rgb)), [rgb])
  return {
    color: rgbColor,
    isDarkColor,
  }
}

type RGB = {
  r: number
  g: number
  b: number
}

// @see https://github.com/bgrins/TinyColor/blob/master/tinycolor.js#L48C5-L48C11
function isDark(rgb: RGB) {
  return getBrightness(rgb) < 128
}

function getBrightness(rgb: RGB): number {
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

function getAverageRGB(imgEl: HTMLImageElement): RGB {
  const blockSize = 5
  const defaultRGB: RGB = { r: 0, g: 0, b: 0 }
  const canvas = document.createElement('canvas')
  const context = canvas.getContext?.('2d')

  if (!context) {
    return defaultRGB
  }

  const height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height
  const width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width
  canvas.height = height
  canvas.width = width

  context.drawImage(imgEl, 0, 0)

  try {
    const rgb = { r: 0, g: 0, b: 0 }
    const { data } = context.getImageData(0, 0, width, height)

    let i = 0
    let count = 0
    while (i < data.length) {
      rgb.r += data[i]
      rgb.g += data[i + 1]
      rgb.b += data[i + 2]
      ++count
      i += blockSize * 4
    }

    rgb.r = Math.floor(rgb.r / count)
    rgb.g = Math.floor(rgb.g / count)
    rgb.b = Math.floor(rgb.b / count)

    return rgb
  } catch (e) {
    return defaultRGB
  }
}
