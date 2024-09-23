import {ExecuteResult, SuccessResult,FailureResult} from "./core/executeResult";
import {captureScreen, clickPoint, findMultiColor} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {colorConfig} from "./config/colorConfig";
import {Step} from "./core/step";
import {RallyHuntQuest} from "../src/hunt";

export class ClickConfirmBattleBtn extends Step {
  execute(): ExecuteResult {
    // let result = findMultiColor(captureScreen(),colorConfig.confirmBattleBtn)
    // if(!result){
    //   return new FailureResult("未找到确认战斗按钮")
    // }
    clickPoint(pointConfig.confirmBattleBtn, 1000)

    return new SuccessResult('ClickConfirmBattleBtn')
  }
}