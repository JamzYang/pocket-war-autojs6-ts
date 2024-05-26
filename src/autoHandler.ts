
import {parseAjColorParam} from "./ParamParser";


export function captureScreen(width: number = 720,height: number = 1280,  quality: number = 100): ImageWrapper{
  return  images.captureScreen()
}


export function findMultiColor(image: ImageWrapper, colorsPath: string): OpenCV.Point | null{
  const [baseColor, paths, options] = parseAjColorParam(colorsPath)
  return images.findMultiColors(image,baseColor,paths,options)

}

export function fromBase64(base64: string): ImageWrapper{
  return images.fromBase64(base64)
}

export function findImage(image: ImageWrapper, template: ImageWrapper, options?: {
  threshold?: number,
  weakThreshold?: number,
  level?: number,
  region?: OmniRegion,
}): OpenCV.Point | null{
  return images.findImage(image,template,options)
}

export function myClick(x: number, y: number, time: number = 400): boolean {
  myLog(`点击坐标:${x},${y}`)
  let result = click(x,y)
  sleep(time)
  return result
}

export function mySwipe(sx: number, sy: number, ex: number, ey: number, duration: number = 300): boolean {
  myLog(`滑动坐标:${sx},${sy}->${ex},${ey}`)
  let result = swipe(sx,sy,ex,ey,duration)
  sleep(duration)
  return result
}

export function myLog(msg: string): void {
  log(msg)
}