import {ExecuteResult, SuccessResult,FailureResult} from "./core/executeResult";
import {captureScreen, clickPoint, findMultiColor} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {colorConfig} from "./config/colorConfig";
import {Step} from "./core/step";
import {RallyHuntQuest} from "../src/hunt";

export class ClickConfirmBattleBtn extends Step {
  execute(): ExecuteResult {
    let result = findMultiColor(captureScreen(),colorConfig.confirmBattleBtn)
    if(!result){
      return new FailureResult("未找到确认战斗按钮")
    }
    clickPoint(pointConfig.confirmBattleBtn, 1000)

    if(this.quest instanceof RallyHuntQuest){ //todo 依赖反转
      // functionConfig.rallyHuntQuest = true;
    }
    return new SuccessResult('ClickConfirmBattleBtn')
  }
}