import {captureScreen, findMultiColor, myClick} from "./helper/autoHandler";
import {colorConfig} from "./config/colorConfig";
import {Step, ToWorld, ClickSearch, ClickOneClickBattle, ClickConfirmBattleBtn} from "./core/step";
import {Quest} from "./core/quest"
import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {ExecuteResult,Failure, SuccessResult} from "./core/executeResult";
import {pointConfig} from "./config/pointConfig";
import {
  ClickConfirmSearchBtn,
  ClickFocusPoint,
  SelectSearchLevel,
} from "./steps";




export class GatherFoodQuest extends Quest {
  protected steps = [
    new ToWorld(),
    new ClickSearch(),
    new SelectResourceFieldTab(),
    new ClickFarmlandPic(),
    new SelectSearchLevel(),
    new ClickConfirmSearchBtn(),
    new ClickFocusPoint(),
    new ClickConfirmGatherBtn(),
    new ClickOneClickBattle(),
    // new GatherResource(),
    // new SelectCommanderSolider(),
    new ClickConfirmBattleBtn(this)
  ]
}



/**
 * 选中出征对像后, 目标信息界面一般出现在窗口上半部,有没有可能出现在下半部? //todo
 */
export class ClickConfirmGatherBtn implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    let result = findMultiColor(captureScreen(), colorConfig.confirmGatherBtn)
    if (result == null) {
      throw new Failure('没有找到确认按钮')
    }
    myClick(result.x, result.y, 600, "ClickConfirmGatherBtn")
    return new SuccessResult('ClickConfirmGatherBtn')
  }
}

export class SelectResourceFieldTab implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.searchResourceTab.x, pointConfig.searchResourceTab.y, 400, "SelectResourceFieldTab")
    return new SuccessResult('SelectResourceFieldTab')
  }
}

export class ClickFarmlandPic implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.searchFarmLandPic.x, pointConfig.searchFarmLandPic.y, 400, "ClickFarmlandPic")
    return new SuccessResult('ClickFarmlandPic');
  }
}