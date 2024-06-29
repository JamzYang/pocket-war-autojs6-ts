import {ExecuteResult, Failure, SuccessResult} from "./executeResult";
import {captureScreen, findMultiColor, myClick, myLog} from "../helper/autoHandler";
import {pointConfig} from "../config/pointConfig";
import {hasBackBtn, hasCloseBtn} from "../helper/finder";
import {colorConfig} from "../config/colorConfig";
import {iconConfig} from "../config/iconConfig";
import {Quest} from "./quest";

export abstract class Step {
  protected quest: Quest;
  constructor(quest: Quest) {
    this.quest = quest;
  }
  abstract execute(): ExecuteResult;
}

export class CheckIdleTeamsStep extends Step {
  execute(): ExecuteResult {
    if (this.quest.getCharacterState.idleTeams < 1) {
      throw new Failure('没有空闲队伍');
    }
    return new SuccessResult('空闲队伍检查通过');
  }
}


/**
 * 主界面搜索
 */
export class ClickSearch extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.mainSearchBtn.x, pointConfig.mainSearchBtn.y, 400, "mainSearchBtn")
    return new SuccessResult('ClickSearch');
  }
}




export class ClickOneClickBattle extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.oneClickBattleBtn.x, pointConfig.oneClickBattleBtn.y, 200, "ClickOneClickBattle")
    return new SuccessResult('ClickOneClickBattle')
  }
}


export class ToWorld extends Step {
  execute(): ExecuteResult {
    toWorld()
    return new SuccessResult('已到世界');
  }
}

export function toWorld(){
  handleCloseBtn()
  handleBackButton();
  if (!isWorldWindow()) {
    clickMainCityBtnOrWorldBtn()
  }

  if (!isWorldWindow()) {
    throw new Failure('回到世界失败');
  }
}

export class ToCity extends Step {
  execute(): ExecuteResult {
    handleCloseBtn()
    handleBackButton();
    if (isWorldWindow()) {
      clickMainCityBtnOrWorldBtn()
    }

    if (!isCityWindow()) {
      throw new Failure('回到主城失败');
    }
    return new SuccessResult('已到主城');
  }
}



function handleBackButton() {
  // myLog("handleBackButton")
  let backBtn = hasBackBtn()
  if (backBtn) {
    //[25,8,84,70]
    myClick(backBtn.x + iconConfig.backBtn.offSet.x, backBtn.y + iconConfig.backBtn.offSet.y, 400, "backBtn");
    // myLog("click backBtn")
    handleBackButton();
  }
}

function handleCloseBtn() {
  // myLog("handleCloseBtn")
  let closeBtn = hasCloseBtn()
  if (closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + 22, closeBtn.y + 22, 400, "closeBtn")
    // myLog("click closeBtn")
    handleCloseBtn()
  }
}


function isWorldWindow() {
  let result = findMultiColor(captureScreen(), colorConfig.mainWindow.mainCityColor)
  return result != null
}

function isCityWindow(): OpenCV.Point | null {
  let result = findMultiColor(captureScreen(), colorConfig.mainWindow.worldColor)
  return result
}

/**
 * 主城和世界界面切换有点慢,多sleep一会儿
 */
function clickMainCityBtnOrWorldBtn() {
  myClick(pointConfig.mainCityWorldBtn.x, pointConfig.mainCityWorldBtn.y, 800, "clickMainCityBtnOrWorldBtn")
}

export function closeDialog(): ExecuteResult {
  let closeBtn = hasCloseBtn()
  if (closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + iconConfig.closeBtn.offSet.x, closeBtn.y + iconConfig.closeBtn.offSet.y, 400, "closeBtn")
    myLog("click closeBtn")
    return new SuccessResult("closeDialog")
  }
  throw new SuccessResult("no dialog close btn found")
}