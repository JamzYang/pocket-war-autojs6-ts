
import {parseAjColorParam} from "./ParamParser";


export function captureScreen(width: number = 720,height: number = 1280,  quality: number = 100): ImageWrapper{
  return  images.captureScreen()
}

export function captureScreenGray(width: number = 720,height: number = 1280,  quality: number = 100): ImageWrapper{
  return  images.grayscale(images.captureScreen())
}

export function findMultiColor(image: ImageWrapper, colorsPath: string): OpenCV.Point | null{
  const [baseColor, paths, options] = parseAjColorParam(colorsPath)
  return images.findMultiColors(image,baseColor,paths,options)

}

export function fromBase64(base64: string): ImageWrapper{
  return images.fromBase64(base64.split("base64,")[1])
}

export function findImage(image: ImageWrapper, template: ImageWrapper, options?: {
  threshold?: number,
  weakThreshold?: number,
  level?: number,
  region?: OmniRegion,
}): OpenCV.Point | null{
  let result = images.findImage(image,template,options)
  image.recycle()
  return result
}





export function matchTemplate(img: ImageWrapper, template: ImageWrapper, options?: {
  threshold?: number;
  weakThreshold?: number;
  level?: number;
  region?: OmniRegion;
  max?: number;
}): Images.MatchingResult {
  return images.matchTemplate(img,template,options)
}



export function myClick(x: number, y: number, time: number = 600, name?: string): boolean {
  // myLog(`点击 ${name}, 坐标:${x},${y}`)
  let result = click(x,y)
  sleep(1000)
  return result
}

export function mySwipe(sx: number, sy: number, ex: number, ey: number, duration: number = 1000): boolean {
  // myLog(`滑动坐标:${sx},${sy}->${ex},${ey}`)
  let result = swipe(sx,sy,ex,ey,duration)
  sleep(2000)
  return result
}

export function myLog(msg: string): void {
  log(msg)
}

export function  mySleep(time: number): void {
  sleep(time)
}

export function ocrText(region: OmniRegion): string[] {
  return ocr.paddle.recognizeText(region)
}

// recognizeText(img: ImageWrapper | string, region: OmniRegion): string[];
// export function ocrTextFromImg(img: ImageWrapper | string, region: OmniRegion): string[] {
//   // return ocr.paddle.recognizeText(img,region)
//   return ocr.paddle.recognizeText(img,region)
// }


export function ocrTextFromImg(img: ImageWrapper | string, region: OmniRegion): org.autojs.autojs.runtime.api.OcrResult[] {
  // return ocr.paddle.recognizeText(img,region)
  return ocr.paddle.detect(img,{region:region,useSlim:true});
}
//recognizeText

export function ocrTextFromImgMlkit(img: ImageWrapper | string, region: OmniRegion): org.autojs.autojs.runtime.api.OcrResult[] {
  // return ocr.paddle.recognizeText(img,region)
  return ocr.mlkit.detect(img,{region:region});
}