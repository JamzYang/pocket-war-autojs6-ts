import {captureScreen, findImage, fromBase64} from './autoHandler'
import {iconConfig} from "./config/iconConfig";



export function dianaIsBack(): boolean {
  // [12,390,230,945] 小地图收起后，出征队列状态概览区域
  let result = findImage(captureScreen(), fromBase64(iconConfig.dianaAvatar.base64),
      {threshold: 0.8,region: [12, 390, 218, 555]})
  if (result) {
    return false
  }
  return true
}