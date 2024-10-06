import {parseAjColorParam} from "./ParamParser";
import { Point } from "../config/pointConfig";

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
  // if(name){
  //   myLog(`点击 ${name}, 坐标:${x},${y}`)
  // }
  let result = click(x,y)
  sleep(time)
  return result
}

export function clickPoint(point: Point, time: number = 600): boolean {
  let result = click(point.x, point.y);
  // myLog(`点击 ${point}, 坐标:${point.x},${point.y}`);
  sleep(time);
  return result;
}

export function mySwipe(sx: number, sy: number, ex: number, ey: number, duration: number = 1000,sleepMillSec: number = 2000): boolean {
  // myLog(`滑动坐标:${sx},${sy}->${ex},${ey}`)
  let result = swipe(sx,sy,ex,ey,duration)
  sleep(sleepMillSec)
  return result
}

export function myLog(msg: string): void {
  log(msg)
}

export function myToast(msg: string): void {
  toastLog(msg);
}

export function myErrorLog(msg: string,data?: any,): void {
  console.error(msg)
}

export function  mySleep(time: number): void {
  sleep(time)
}

export function ocrText(range: number[]): string[] {
  //[171,14,253,42]
  return ocr.paddle.recognizeText(toOmnRegion(range))
}

export function ocrTextLite(range: number[]): string[] {
  //[171,14,253,42]
  return ocr.paddle.recognizeText({region: toOmnRegion(range), useSlim: false})
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

export function ocrDetectWithImg(img: ImageWrapper, range: number[]): org.autojs.autojs.runtime.api.OcrResult[] {
  return ocr.paddle.detect(img,{region:toOmnRegion(range)});
}

export function ocrDetect(range: number[]): org.autojs.autojs.runtime.api.OcrResult[] {
  ocr.paddle.detect()
  return ocr.paddle.detect(toOmnRegion(range));
}

export function ocrDetectScreen(): org.autojs.autojs.runtime.api.OcrResult[] {
  return ocr.paddle.detect();
}


function toOmnRegion(range: number[]): OmniRegion{
  return [range[0],range[1],range[2]-range[0], range[3]-range[1]]
}