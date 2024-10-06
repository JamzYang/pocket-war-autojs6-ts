import {Quest} from "./core/quest";
import {HuntType} from "./enum";
import {ClickSearch, Step, ToWorld} from "./core/step";
import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {
  clickPoint,
  myClick,
  myLog,
  findImage,
  mySwipe,
  captureScreen,
  fromBase64,
  matchTemplate,
  ocrText, mySleep
} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import {intervalConfig} from "./config/intervalConfig";
import {hasCloseBtn} from "./helper/finder";

let skipDonghuaBtn = {x:629, y:1100}
//快速战斗之后的领取 窗口
let pickUpBtn = {x:367, y:1130}

export class ExpeditionQuest extends Quest {
  protected getInterval(): number {
    return intervalConfig.expediton
  }
  protected steps = [
    new ToWorld(this),
    new ToExpedition(this),
    new CollectRewards(this),
    new FastBattle(this),
  ]
  // postExecute(): ExecuteResult {
  //   this.functionConfig.soloHunt.times -= 1;
  //   return new SuccessResult("postExecute SoloHuntQuest");
  // }
}

export class ToExpedition extends Step {
  execute() {
    myClick(pointConfig.intelligenceIcon.x, pointConfig.intelligenceIcon.y)
    let findTimes = 0;
    let result  = this.findExpeditionIcon()
    while(findTimes < 3 && result == null) {
      mySwipe(360,900,360,500,2000)
      result = this.findExpeditionIcon()
      findTimes ++
    }
    if(result == null) {
      myLog("can not find Expedition icon")
      return new ExecuteResult("can not find Expedition icon")
    }
    myLog("找到远征行动")
    ////`前往button`
    myClick(result.x + 520, result.y + 50, 1000,"前往远程")
    return new SuccessResult("ToExpedition success");
  }
  private findExpeditionIcon(): OpenCV.Point | null {
    let icon = fromBase64(iconConfig.expedition.base64)
    let matchingResult = matchTemplate(captureScreen(), icon, { threshold: 0.8})
    if(matchingResult.points.length > 0){
      return matchingResult.points[0]
    }
    return null;
  }
}

class FastBattle extends Step {
  execute() {
    myClick(pointConfig.expeditionFastBattleBtn.x, pointConfig.expeditionFastBattleBtn.y)
    //花费大于100钻,就不快速收割
    if(this.parseCost() >= 100){
      let closeBtn = hasCloseBtn()
      if (closeBtn != null) {
        myClick(closeBtn.x + 22, closeBtn.y + 22, 400, "closeBtn")
      }
      return;
    }
    myClick(pointConfig.expeditionFreeFastBattleBtn.x, pointConfig.expeditionFreeFastBattleBtn.y)
    myClick(skipDonghuaBtn.x,skipDonghuaBtn.y,1500)
    myClick(pickUpBtn.x,pickUpBtn.y,1500)
  }

  private parseCost(): number {
    //
    let text = ocrText([212,811,522,954])
    if(text.length > 0){
      if(text.some(item => item.includes("免") || item.includes("费") || item.includes("兔"))){
        return 0
      }
      if(text.some(item => item.includes("50"))){
        return 50
      }
      if(text.some(item => item.includes("100"))){
        return 100
      }
    }
    return 1000
  }
}

class CollectRewards extends Step {
  execute() {
    myClick(pointConfig.expeditionCollectRewards.x, pointConfig.expeditionCollectRewards.y, 1000)
    myClick(pointConfig.expeditionConfirmCollect.x, pointConfig.expeditionConfirmCollect.y,1500)
  }
}