import {Quest} from "./core/quest";
import {HuntType} from "./enum";
import {ClickConfirmBattleBtn, ClickSearch, Step, ToWorld} from "./core/step";
import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {
  myClick,
  myLog,
  findImage,
  mySwipe,
  captureScreen,
  fromBase64,
  matchTemplate,
  ocrText
} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import {intervalConfig} from "./config/intervalConfig";
import {hasCloseBtn} from "./helper/finder";

export class ExpeditionQuest extends Quest {
  protected getInterval(): number {
    return intervalConfig.expediton
  }
  protected steps = [
    new ToWorld(),
    new ToExpedition(),
    new CollectRewards(),
    new FastBattle(),
  ]
  // postExecute(): ExecuteResult {
  //   this.functionConfig.soloHunt.times -= 1;
  //   return new SuccessResult("postExecute SoloHuntQuest");
  // }
}

export class ToExpedition implements Step {
  execute(characterState?: CharacterState, functionConfig?: FunctionConfig): ExecuteResult {
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

class FastBattle implements Step {
  execute(characterState?: CharacterState, functionConfig?: FunctionConfig): ExecuteResult {
    if(this.parseCost() >= 100){
      let closeBtn = hasCloseBtn()
      if (closeBtn != null) {
        myClick(closeBtn.x + 22, closeBtn.y + 22, 400, "closeBtn")
      }
      return new SuccessResult("FastBattle success");
    }
    myClick(pointConfig.expeditionFastBattleBtn.x, pointConfig.expeditionFastBattleBtn.y)
    myClick(pointConfig.expeditionFreeFastBattleBtn.x, pointConfig.expeditionFreeFastBattleBtn.y)
    return new SuccessResult("FastBattle success");
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

class CollectRewards implements Step {
  execute(characterState?: CharacterState, functionConfig?: FunctionConfig): ExecuteResult {
    myClick(pointConfig.expeditionCollectRewards.x, pointConfig.expeditionCollectRewards.y, 1000)
    myClick(pointConfig.expeditionConfirmCollect.x, pointConfig.expeditionConfirmCollect.y)
    return new SuccessResult("CollectRewards success");
  }
}