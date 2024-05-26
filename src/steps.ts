import {CharacterState, FunctionConfig, ExecuteResult, FailureResult, SuccessResult} from './types'
import {captureScreen, findMultiColor} from "./autoHandler";

export interface Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult;
}


export class CheckIdleTeamsStep implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    if (characterState.idleTeams < 1) {
      return new FailureResult('没有空闲队伍');
    }
    return new SuccessResult('空闲队伍检查通过');
  }
}

export class ToWorld implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    handleBackButton();
    if(isCityWindow()) {
      clickMainCityBtnOrWorldBtn()
    }

    if(!isWorldWindow()){
      return new FailureResult('回到世界失败');
    }
    return new SuccessResult('已到世界');
  }
}

export class ToCity implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    handleBackButton();
    if(isWorldWindow()) {
      clickMainCityBtnOrWorldBtn()
    }

    if(!isCityWindow()){
      return new FailureResult('回到主城失败');
    }
    return new SuccessResult('已到主城');
  }
}



export class ClickCoinPoll implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    clickPlusCoin();
    clickCoinHarvester();
    return new SuccessResult("金币收割成功")
    function clickPlusCoin() {

    }
    function clickCoinHarvester() {

    }
  }
}


function handleBackButton() {
  if (hasBackBtn()) {
    clickBackBtn();
    handleBackButton(); // 递归调用自己
  }
}

function hasBackBtn(): boolean {
  //todo
  let image = captureScreen()
  return false;
}

function clickBackBtn() {
  //todo
}

function isWorldWindow(): boolean {
  //todo
  let result = findMultiColor(captureScreen(), 'mainCityColor')
  if(result == null || result[0] == null){
    return false
  }else {
    return true;
  }
}

function isCityWindow(): boolean {
  //todo
  return true;
}

function clickMainCityBtnOrWorldBtn() {

}
