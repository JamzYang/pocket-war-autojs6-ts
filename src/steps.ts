import {CharacterState, ExecuteResult, FailureResult, FunctionConfig, SuccessResult} from './types'
import {captureScreen, findMultiColor, myClick, mySwipe, myLog} from "./autoHandler";
import {colorConfig} from "./config/colorConfig";
import {iconConfig} from "./config/iconConfig";
import {pointConfig} from "./config/pointConfig";
import {hasBackBtn, hasCloseBtn} from "./finder";

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

export class SelectSoloEnemy implements Step {
    execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
        throw new Error('Method not implemented.');
    }
}

export class ClickSearch implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.mainSearchBtn.x, pointConfig.mainSearchBtn.y)
    return new SuccessResult('点击搜索');
  }
}

export class SelectResourceField implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    throw new Error('Method not implemented.');
  }
}

export class GatherResource implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    throw new Error('Method not implemented.');
  }
}

/**
 * 攻击几次, 集结. 对话框
 */
export class AttackEnemy implements Step {
  //判断单刷还是集结可以在创建Step时传个变量. 或者根据配置文件也可以,但是 配置中的单刷和集结得互斥
    execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
      //根据配置文件,攻击几次或是集结
        throw new Error('Method not implemented.');
    }
}

export class SelectCommanderSolider implements Step {
    execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
      //根据配置文件,决定选择哪个快捷编队,或是单兵,又或是一键
        throw new Error('Method not implemented.');
    }
}

export class GoFight implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    //点击出征按钮
    //确认出征成功
    throw new Error('Method not implemented.');
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

export class ToCoinHarvester implements Step{
    execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
        myClick(pointConfig.coinBar.x,pointConfig.coinBar.y)
        mySwipe(560,700,580,500)
        myClick(pointConfig.coinHarvester.x, pointConfig.coinHarvester.y, 800)
      return new SuccessResult("coinHarvester")
    }
}


export class ClickCoinPoll implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    clickCoinHarvesterIcon();
    fastHarvest();
    return new SuccessResult("金币收割成功")

    function fastHarvest() {
      let checkWindowResult = findMultiColor(captureScreen(), colorConfig.coin.fastHarvestWindow)
      if (checkWindowResult) {
        let checkFree = findMultiColor(captureScreen(), colorConfig.coin.freeFastHarvest)
        if (checkFree) {
          myClick(checkFree.x, checkFree.y)
          closeDialog()
          return new SuccessResult("fast harvest")
        }
      }
      //关闭窗口
      closeDialog()
      return new FailureResult("fast harvest failure")
    }
    function clickCoinHarvesterIcon() {
      myClick(pointConfig.focusPoint.x, pointConfig.focusPoint.y - 90)
    }
  }
}


function handleBackButton() {
  myLog("handleBackButton")
  let backBtn = hasBackBtn()
  if (backBtn) {
    //[25,8,84,70]
    myClick(backBtn.x + iconConfig.backBtn.offSet.x, backBtn.y + iconConfig.backBtn.offSet.y);
    myLog("click backBtn")
    handleBackButton();
  }
}

function handleCloseBtn(){
  myLog("handleCloseBtn")
  let closeBtn = hasCloseBtn()
  if(closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + 22, closeBtn.y + 22)
    myLog("click closeBtn")
    handleCloseBtn()
  }
}


function isWorldWindow() {
  let result = findMultiColor(captureScreen(), colorConfig.mainWindow.mainCityColor)
  return result !=null
}

function isCityWindow(): OpenCV.Point | null {
  let result = findMultiColor(captureScreen(), colorConfig.mainWindow.worldColor)
  return result
}

/**
 * 主城和世界界面切换有点慢,多sleep一会儿
 */
function clickMainCityBtnOrWorldBtn() {
  myClick(pointConfig.mainCityWorldBtn.x, pointConfig.mainCityWorldBtn.y, 800)
}

function closeDialog(): ExecuteResult {
  let closeBtn = hasCloseBtn()
  if(closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + iconConfig.closeBtn.offSet.x, closeBtn.y + iconConfig.closeBtn.offSet.y)
    myLog("click closeBtn")
    return new SuccessResult("closeDialog")
  }
  return new FailureResult("closeDialog")
}
