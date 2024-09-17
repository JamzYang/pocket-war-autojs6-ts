import {
  captureScreen,
  captureScreenGray,
  findImage,
  findMultiColor,
  fromBase64,
  matchTemplate,
  myLog
} from "./autoHandler";
import {iconConfig} from "../config/iconConfig";
import {colorConfig} from "../config/colorConfig";

let currentWorldIcon: string;
let currentCityIcon: string;

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


export function  getCurrentWorldIcon(): string {
  if(currentWorldIcon) {
    myLog("使用缓存==>当前世界图标")
    return currentWorldIcon;
  }
  let result = findImage(captureScreen(), fromBase64(iconConfig.worldPhrase1.base64))
  if (result) {
    currentWorldIcon = iconConfig.worldPhrase1.base64;
    currentCityIcon = iconConfig.cityPhrase1.base64;
    myLog("图像识别==>当前世界图标为: 阶段1");
    return currentWorldIcon;
  }
  result = findImage(captureScreen(), fromBase64(iconConfig.worldPhrase3.base64))
  if (result) {
    currentWorldIcon = iconConfig.worldPhrase3.base64;
    currentCityIcon = iconConfig.cityPhrase3.base64;
    myLog("当前世界图标为: 阶段3");
    return currentWorldIcon;
  }
  throw new Error("未找到世界图标,请重启脚本");
}

export function  getCurrentCityIcon(): string {
  if(currentCityIcon) {
    return currentCityIcon;
  }
  getCurrentWorldIcon();
  return currentCityIcon;
}