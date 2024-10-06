
import {
  captureScreen,
  findImage,
  fromBase64,
  myClick,
  clickPoint,
  myLog,
  mySleep,
  mySwipe,
  ocrDetect, myToast
} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import * as autoHandler from "./helper/autoHandler";
import {repeatSeconds} from "./config/env.conf";
import {intervalConfig} from "./config/intervalConfig";
import {Quest} from "./core/quest";
import {Step, ToCity, ToWorld} from "./core/step";
import {ExecuteResult, NeedRepeatFailure, SuccessResult} from "./core/executeResult";


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
    new ToCity(this),
    new ToOceanTreasure(this),
    new RecognizeAndPick(this),
    new Detect(this),
  ]
}

export class ToOceanTreasure extends Step {
  execute() {
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
  }
}

export class RecognizeAndPick extends Step {
  execute() {
    const {timeStr, seconds, type} = orcOceanTreasureCountDown()
      //当前系统时间 加上 seconds
      this.quest.nextExecuteTime = new Date().getTime() + seconds * 1000;
      let nextExecuteTime = new Date(this.quest.nextExecuteTime);
      let nextExecuteTimeStr = nextExecuteTime.toTimeString().split(' ')[0];
      myToast("深海下次收取时间：" + nextExecuteTimeStr)
  }
}

export class Detect extends Step {
  execute() {
    let ocrResults = ocrDetectText();
    //当前系统时间 加上 seconds
    if(ocrResults.length >= 1){
      ocrResults.forEach(item => {
        if((item.label.includes("测") || item.label.includes("探")) && item.label.length ==2) {
          myClick(item.bounds.centerX(), item.bounds.centerY())
        }
      })
    }
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

export function orcOceanTreasureCountDown(): { timeStr: string, seconds: number, type: TreasureState } {
  let ocrResults = ocrDetectText();
  myLog("倒计时识别结果=>" + JSON.stringify(ocrResults))
  if (ocrResults.length >= 1) {
      let shortestTimeStr = "";
      let shortestSeconds = Infinity;
      ocrResults.forEach(item => {
        if(item.label.includes("领取")){
          myClick(item.bounds.centerX(), item.bounds.centerY())
          myClick(pointConfig.targetCenter.x,pointConfig.targetCenter.y)
        }
      })
      ocrResults.forEach(item => {
          if (item.label.includes(":") && (item.label.match(/:/g) || []).length === 2) {
            const seconds = timeStringToSeconds(item.label);
            if (seconds < shortestSeconds) {
              shortestTimeStr = item.label;
              shortestSeconds = seconds;
            }
          }
      });

      return {
        timeStr: shortestTimeStr,
        seconds: shortestSeconds,
        type: TreasureState.InDetection
      };
  }
  throw new NeedRepeatFailure("深海倒计时识别结果错误", repeatSeconds() * 0.1)
}

function ocrDetectText(): org.autojs.autojs.runtime.api.OcrResult[]{
  return autoHandler.ocrDetect([43,980,685,1115])
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
//PendingDetection, PendingCollection, InDetection.
enum TreasureState {
  PendingDetection = '待探测',
  PendingCollection = '待领取',
  InDetection = '探测中',  //图片是立即完成
}