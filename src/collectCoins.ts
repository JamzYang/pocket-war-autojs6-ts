import {closeDialog, Step, ToCity} from "./core/step";

import {Quest} from "./core/quest";
import {ExecuteResult, Failure, SuccessResult} from "./core/executeResult";

import {
  captureScreen,
  clickPoint,
  findImage,
  findMultiColor,
  fromBase64,
  myClick,
  myLog,
  mySwipe
} from "./helper/autoHandler";
import {iconConfig} from "./config/iconConfig"
import {pointConfig} from "./config/pointConfig"
import {colorConfig} from "./config/colorConfig"
import {intervalConfig} from "./config/intervalConfig";
import {EnemyName} from "./enum";


/**
 * 注意: 点收割机时 有可能弹出未达到最佳领取状态的提示窗
 */
export class CollectCoinsQuest extends Quest {
  public name: string = "金币收取";
  public nextExecuteTime: number = 0;
  protected steps = [
    new ToCity(this),
    new ToCoinHarvester(this),
    new ClickCoinPoll(this)
  ]
  protected getInterval(): number {
    return intervalConfig.coin
  }
}

interface EnemyObject {
  name: EnemyName;
  times: number;
}



export class ToCoinHarvester extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.coinBar.x, pointConfig.coinBar.y, 400, "coinBar")
    mySwipe(560, 700, 580, 500)
    myClick(pointConfig.coinHarvester.x, pointConfig.coinHarvester.y, 800, "coinHarvester")
    return new SuccessResult("coinHarvester")
  }
}


export class ClickCoinPoll extends Step {
  execute(): ExecuteResult {

    //[259,391,457,715]
    // let result = findImage(captureScreen(), fromBase64(iconConfig.coinIcon.base64),
    //     { region: [250,390,200,400], threshold: 0.6})
    // if (result) {
    //   myClick(result.x + iconConfig.coinIcon.offSet.x, result.y + iconConfig.coinIcon.offSet.y, 600, "coinIcon")
    // } else {
    //   // throw new Failure("coinIcon not found") //todo
    //   myLog("coinIcon not found");
    // }
    clickPoint(pointConfig.coinHarvestIcon)
    fastHarvest();  //todo 快速收割先不做
    this.quest.nextExecuteTime = new Date().getTime() + 60 * 1000;
    myLog("金币下次时间:"+ (new Date(this.quest.nextExecuteTime).toLocaleString()))
    return new SuccessResult("金币收割成功")
  }
}

function fastHarvest() {
  //点下金币收割icon, 弹出快速收割窗口
  clickPoint(pointConfig.coinHarvestIcon)
  let checkWindowResult = findImage(captureScreen(), fromBase64(iconConfig.coinFastHarvestWindow.base64))
  if (checkWindowResult) {
    let checkFree = findImage(captureScreen(), fromBase64(iconConfig.coinFastHarvestBtn.base64))
    if (checkFree) {
      myClick(
          checkFree.x + iconConfig.coinFastHarvestBtn.offSet.x,
          checkFree.y + iconConfig.coinFastHarvestBtn.offSet.y,
          400, "fastHarvest checkFree")
      closeDialog()
    }
  }
  //关闭窗口
  // closeDialog()
}