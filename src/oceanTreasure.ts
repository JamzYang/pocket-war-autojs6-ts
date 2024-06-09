import {
  CharacterState,
  ExecuteResult,
  FunctionConfig,
  NeedRepeatFailure,
  SuccessResult,
  Quest
} from "./types";
import {captureScreen, findImage, fromBase64, myClick, myLog, mySleep, mySwipe} from "./autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import {Step, ToWorld} from "./steps";
import * as autoHandler from "./autoHandler";
import {repeatSeconds} from "./config/env.conf";
import {intervalConfig} from "./config/intervalConfig";


const points = {
  detector1: {x:152,y:1045},
  detector2: {x:363,y:1048},
  detector3: {x:576,y:1043}
}


export class OceanTreasureQuest extends Quest {
  public weight = 10;
  public nextExecuteTime: number = 0;

  protected getInterval(): number {
    return intervalConfig.oceanTreasure
  }
  protected steps = [
    new ToWorld(),
    new ToOceanTreasure(this),
    new RecognizeState(this)
  ]

}

export class ToOceanTreasure implements Step {
  private quest: OceanTreasureQuest;
  constructor(quest: OceanTreasureQuest) {
    this.quest = quest
  }

  execute(characterState?: CharacterState, functionConfig?: FunctionConfig): ExecuteResult {
    mySleep(1000)
    myClick(pointConfig.valueEventsIcon.x, pointConfig.valueEventsIcon.y, 1000, "ClickValueEventsIcon")
    let result
    for (let i = 0; i < 10; i++) {
      result = findImage(captureScreen(), fromBase64(iconConfig.oceanTreasure.base64), {
        threshold: 0.8,
        region: [0, 70, 720, 120]
      })
      if(result){
        break
      }
      myLog("滑动"+i)
      mySwipe(350, 125, 15, 125)
    }
    if (result) {
      myClick(result.x + iconConfig.oceanTreasure.offSet.x,
          result.y + iconConfig.oceanTreasure.offSet.y);
      return new SuccessResult("");
    }else {
      throw new Error("未找到深海活动")
    }
    return new SuccessResult("");
  }
}

export class RecognizeState implements Step {
  private quest: OceanTreasureQuest;
  constructor(quest: OceanTreasureQuest) {
    this.quest = quest
  }

  execute(characterState?: CharacterState, functionConfig?: FunctionConfig): ExecuteResult {
    const {timeStr, seconds, type} = orcOceanTreasureCountDown()
    if (type === '进行中') {
      //当前系统时间 加上 seconds
      this.quest.nextExecuteTime = new Date().getTime() + seconds * 1000 + 10 * 1000; //加10秒冗余
      myLog("深海下次收取时间：" + timeStr)
    } else if (type === '待领取') {
      clickDetector(functionConfig?.events.oceanTreasure.detectorNum as number)
      clickDetector(functionConfig?.events.oceanTreasure.detectorNum as number)
      this.quest.nextExecuteTime = new Date().getTime() + 3600 * 1000;
    } else if (type === '待探测') {
      clickDetector(functionConfig?.events.oceanTreasure.detectorNum as number)
      this.quest.nextExecuteTime = new Date().getTime() + 3600 * 1000;
    }
    return new SuccessResult("oceanTreasure RecognizeState");
  }
}

function clickDetector(detectorNum: number){
  myClick(points.detector1.x, points.detector1.y)
  //点一下中间, 关掉收取成功的提示窗
  myClick(pointConfig.focusPoint.x,pointConfig.focusPoint.y)
  if(detectorNum > 1){
    myClick(points.detector2.x, points.detector2.y)
    myClick(pointConfig.focusPoint.x,pointConfig.focusPoint.y)
    if(detectorNum > 2){
      myClick(points.detector3.x, points.detector3.y)
      myClick(pointConfig.focusPoint.x,pointConfig.focusPoint.y)
    }
  }
}

export function orcOceanTreasureCountDown(): { timeStr: string, seconds: number, type: string } {
  //倒计时文字区域 [88,1031,660,1068] 转成 region: [88,1031,580,37]
//倒计时区域 [76,1004,665,1098] 转成region   [76,1004,589,94]
  let text = autoHandler.ocrText([76, 1004, 589, 94])
  myLog("倒计时识别结果=>" + JSON.stringify(text))
  if (text.length >= 1) {
      if (text.some(item => item.includes("立即") || item.includes("完成"))) {
        let timeStr = text.find(item => item.includes(":"))
        if(timeStr){
          let seconds = timeStringToSeconds(timeStr)
          return {timeStr: timeStr, seconds: seconds, type: "进行中"}
        }
      }
      if (text.some(item => item.includes("领取"))) {
        return {timeStr: "", seconds: 0, type: "待领取"}
      }
      if (text.some(item => (item.includes("探测")) && item.length == 2)) {
        return {timeStr: "", seconds: 0, type: "待探测"}
      }
  }
  mySleep(1000)
  throw new NeedRepeatFailure("深海倒计时识别结果错误", repeatSeconds() * 0.1)
}

function timeStringToSeconds(timeString: string): number {
  const timeParts = timeString.split(':');

  // 确保时间字符串是有效的格式
  if (timeParts.length !== 3) {
    throw new Error("Invalid time format. Expected format HH:MM:SS");
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  // 检查解析是否成功
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    throw new Error("Invalid time format. Could not parse numbers.");
  }

  return hours * 3600 + minutes * 60 + seconds;
}