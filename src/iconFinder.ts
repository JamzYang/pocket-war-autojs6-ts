import {captureScreen, findImage, fromBase64} from "./autoHandler";
import {iconConfig} from "./config/iconConfig";

export function hasBackBtn(): OpenCV.Point | null {
  let icon = fromBase64(iconConfig.backBtn.base64)
  return findImage(captureScreen(), icon, { threshold: 0.8})
}

export function hasCloseBtn(): OpenCV.Point | null {
  let icon = fromBase64(iconConfig.closeBtn.base64)
  return findImage(captureScreen(), icon, { threshold: 0.8})
}