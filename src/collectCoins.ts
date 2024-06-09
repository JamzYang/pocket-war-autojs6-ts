import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {Step,ToWorld, ToCity, ClickConfirmBattleBtn, closeDialog} from "./core/step";
import {Quest} from "./core/quest";
import {ExecuteResult,SuccessResult, NeedRepeatFailure, Failure} from "./core/executeResult";

import {myLog,myClick,mySleep,captureScreen,captureScreenGray,
  matchTemplate,mySwipe,fromBase64,findImage,findMultiColor}
  from "./helper/autoHandler";
import {orcRallyEnemyName, orcTeamNum} from "./ocr"
import {iconConfig} from "./config/iconConfig"
import {pointConfig} from "./config/pointConfig"
import {colorConfig} from "./config/colorConfig"
import {repeatSeconds} from "./config/env.conf";
import {intervalConfig} from "./config/intervalConfig";
import {EnemyName} from "./enum";



/**
 * 注意: 点收割机时 有可能弹出未达到最佳领取状态的提示窗
 */
export class CollectCoinsQuest extends Quest {
  public nextExecuteTime: number = 0;
  protected steps = [new ToCity(),new ToCoinHarvester(), new ClickCoinPoll(this)]
  protected getInterval(): number {
    return intervalConfig.coin
  }
}

interface EnemyObject {
  name: EnemyName;
  times: number;
}



export class ToCoinHarvester implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.coinBar.x, pointConfig.coinBar.y, 400, "coinBar")
    mySwipe(560, 700, 580, 500)
    myClick(pointConfig.coinHarvester.x, pointConfig.coinHarvester.y, 800, "coinHarvester")
    return new SuccessResult("coinHarvester")
  }
}


export class ClickCoinPoll implements Step {
  private quest: CollectCoinsQuest;
  constructor(quest: CollectCoinsQuest) {
    this.quest = quest
  }

  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {

    //[259,391,457,715]
    let result = findImage(captureScreen(), fromBase64(iconConfig.coinIcon.base64),
        { region: [250,390,200,400], threshold: 0.6})
    if (result) {
      myClick(result.x + iconConfig.coinIcon.offSet.x, result.y + iconConfig.coinIcon.offSet.y, 600, "coinIcon")
    } else {
      // throw new Failure("coinIcon not found") //todo
    }
    // fastHarvest();  //todo 快速收割先不做
    this.quest.nextExecuteTime = new Date().getTime() + 60 * 1000;
    myLog("金币下次时间:"+ (new Date(this.quest.nextExecuteTime).toLocaleString()))
    return new SuccessResult("金币收割成功")

    function fastHarvest() {
      let checkWindowResult = findMultiColor(captureScreen(), colorConfig.coin.fastHarvestWindow)
      if (checkWindowResult) {
        let checkFree = findMultiColor(captureScreen(), colorConfig.coin.freeFastHarvest)
        if (checkFree) {
          myClick(checkFree.x, checkFree.y, 400, "fastHarvest checkFree")
          closeDialog()
          return new SuccessResult("fast harvest")
        }
      }
      //关闭窗口
      closeDialog()
      throw new Failure("fast harvest failure")
    }
  }
}
