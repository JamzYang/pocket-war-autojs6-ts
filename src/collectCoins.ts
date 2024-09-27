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
  public weight = 10;
  protected steps = [
    new ToCity(this),
    new ToCoinHarvester(this),
    new ClickCoinPoll(this)
  ]
  protected getInterval(): number {
    return intervalConfig.coin
  }
}

export class ToCoinHarvester extends Step {
  execute() {
    myClick(pointConfig.coinBar.x, pointConfig.coinBar.y, 400, "coinBar")
    mySwipe(560, 700, 580, 500)
    myClick(pointConfig.coinHarvester.x, pointConfig.coinHarvester.y, 800, "coinHarvester")
    return new SuccessResult("coinHarvester")
  }
}


export class ClickCoinPoll extends Step {
  execute() {
    clickPoint(pointConfig.coinHarvestIcon)
    fastHarvest();
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