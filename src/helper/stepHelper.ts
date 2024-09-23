import {captureScreen, clickPoint, fromBase64, matchTemplate} from "./autoHandler";
import {pointConfig} from "../config/pointConfig";
import {iconConfig} from "../config/iconConfig";


export function selectFormation(formationNum) {
  // if (typeof formationNum !== 'number') {
  //   throw new Error(`formationNum must be a number, but got ${typeof formationNum}`);
  // }
  let formationInt = parseInt(formationNum.toString()) //todo 这里workaround下,后续解决.
  switch (formationInt) {
    case 1:
      clickPoint(pointConfig.formationNum1)
      break;
    case 2:
      clickPoint(pointConfig.formationNum2)
      break;
    case 3:
      clickPoint(pointConfig.formationNum3)
      break;
    case 4:
      clickPoint(pointConfig.formationNum4)
      break;
    case 5:
      clickPoint(pointConfig.formationNum5)
      break;
    case 6:
      clickPoint(pointConfig.formationNum6)
      break;
    case 7:
      clickPoint(pointConfig.formationNum7)
      break;
    case 8:
      clickPoint(pointConfig.formationNum8)
      break;
    default:
      throw new Error(`SelectCommanderSolider: formationNum: ${formationNum} is not in range 1-8. `)
  }
}

export function heroIsSelected(): boolean {
  let matchingResult =  matchTemplate(captureScreen(),fromBase64(iconConfig.heroSelectBlank.base64))
  return matchingResult.points.length <= 0;
}