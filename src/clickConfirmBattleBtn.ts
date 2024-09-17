import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {clickPoint} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {Step} from "./core/step";
import {RallyHuntQuest} from "../src/hunt";

export class ClickConfirmBattleBtn extends Step {
  execute(): ExecuteResult {
    clickPoint(pointConfig.confirmBattleBtn, 800)

    if(this.quest instanceof RallyHuntQuest){ //todo 依赖反转
      // functionConfig.rallyHuntQuest = true;
    }
    return new SuccessResult('ClickConfirmBattleBtn')
  }
}