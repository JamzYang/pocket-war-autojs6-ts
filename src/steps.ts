import {CharacterState, FunctionConfig, ExecuteResult, FailureResult, SuccessResult} from './types'
import {captureScreen, findImage, findMultiColor, fromBase64, myClick} from "./autoHandler";
import {colorConfig} from "./colorConfig";
import {iconConfig} from "./iconConfig";
import {pointConfig} from "./pointConfig";

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
    handleCloseBtn()
    handleBackButton();
    if(!isWorldWindow()) {
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
    handleCloseBtn()
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
  console.info("handleBackButton")
  let backBtn = hasBackBtn()
  if (backBtn) {
    //[25,8,84,70]
    myClick(backBtn.x + 30, backBtn.y + 30);
    console.info("click backBtn")
    handleBackButton();
  }
}

function handleCloseBtn(){
  console.info("handleCloseBtn")
  let closeBtn = hasCloseBtn()
  if(closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + 22, closeBtn.y + 22)
    console.info("click closeBtn")
    handleCloseBtn()
  }
}

function hasBackBtn(): OpenCV.Point | null {
  let icon = fromBase64(iconConfig.backBtn)
  return findImage(captureScreen(), icon)
}

function hasCloseBtn(): OpenCV.Point | null {
  let icon = fromBase64(iconConfig.closeBtn)
  return findImage(captureScreen(), icon)
}


function isWorldWindow() {
  let result = findMultiColor(captureScreen(), colorConfig.mainWindow.mainCityColor)
  return result !=null
}

function isCityWindow(): OpenCV.Point | null {
  let result = findMultiColor(captureScreen(), colorConfig.mainWindow.worldColor)
  return result
}

function clickMainCityBtnOrWorldBtn() {
  myClick(pointConfig.mainCityWorldBtn.x, pointConfig.mainCityWorldBtn.y)
}
