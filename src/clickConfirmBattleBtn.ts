import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {myClick} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {Step} from "./core/step";
import {RallyHuntQuest} from "../src/hunt";

export class ClickConfirmBattleBtn extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.confirmBattleBtn.x, pointConfig.confirmBattleBtn.y, 800, "ClickConfirmBattleBtn")

    if(this.quest instanceof RallyHuntQuest){ //todo 依赖反转
      // functionConfig.rallyHuntQuest = true;
    }
    return new SuccessResult('ClickConfirmBattleBtn')
  }
}