import {captureScreen, captureScreenGray, findImage, findMultiColor, fromBase64, matchTemplate} from "./autoHandler";
import {iconConfig} from "../config/iconConfig";
import {colorConfig} from "../config/colorConfig";

export function hasBackBtn(): OpenCV.Point | null {
  let icon = fromBase64(iconConfig.backBtn.base64)
  return findImage(captureScreen(), icon, { threshold: 0.8})
}

export function hasCloseBtn(): OpenCV.Point | null {
  let icon = fromBase64(iconConfig.closeBtn.base64)
  return findImage(captureScreen(), icon, { threshold: 0.8})
}

/**
 * 小地图展开时的向下小三角
 */
export function hasDownwardTriangle(): OpenCV.Point | null{
  return  findMultiColor(captureScreen(), colorConfig.downwardTriangleIcon)
  // let icon = fromBase64(iconConfig.downwardTriangleIcon.base64)
  // //[5,159,248,220]
  // return findImage(captureScreen(), icon, { threshold: 0.7,region: [0, 160, 250, 60]})
}