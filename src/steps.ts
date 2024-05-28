import {CharacterState, ExecuteResult, FailureResult, FunctionConfig, SuccessResult} from './types'
import {
  captureScreen,
  findMultiColor,
  myClick,
  mySwipe,
  myLog,
  findImage,
  fromBase64,
  matchTemplate, ocrText, ocrTextFromImg
} from "./autoHandler";
import {colorConfig} from "./config/colorConfig";
import {iconConfig} from "./config/iconConfig";
import {pointConfig} from "./config/pointConfig";
import {hasBackBtn, hasCloseBtn} from "./finder";
import {orcRallyEnemyName} from "./ocr";

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
    myClick(pointConfig.mainSearchBtn.x, pointConfig.mainSearchBtn.y, 400,"mainSearchBtn")
    return new SuccessResult('ClickSearch');
  }
}

/**
 * 选中出征对像后, 目标信息界面一般出现在窗口上半部,有没有可能出现在下半部? //todo
 */
export class ClickConfirmGatherBtn implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    let result = findMultiColor(captureScreen(), colorConfig.confirmGatherBtn)
    if(result == null) {
      return new FailureResult('没有找到确认按钮')
    }
    myClick(result.x,result.y, 600,"ClickConfirmGatherBtn")
    return new SuccessResult('ClickConfirmGatherBtn')
  }
}

//跟车页 卡片之间垂直间隔610px,
export class GetInBus implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    //怪物名字 [496,309,684,352] 中心点： 349 272  相比加号中心 x偏移 147， y偏移 37  名字框 高 43 宽 188
    //这个方法有个问题。多点找色只能找到最上面一个
    // let result = findMultiColor(img, colorConfig.rallyJoinInIcon)

    //上车图标区域[318,242,383,309]  怪物文字栏 482,305  682, 345  x偏移164 y偏移 63 宽 131 高 113
    //最后一列上车图标垂直区域 [311,236,389,943]
    let img = captureScreen()
    const matchingResult = matchTemplate(img, fromBase64(iconConfig.getInBusIcon.base64), {
      region: [311,236, 78, 710], // 或者 org.opencv.core.Rect 或 android.graphics.Rect 对象
    });

    if(matchingResult.matches.length > 0) {
      matchingResult.matches.forEach(match => {
        let enemyName = orcRallyEnemyName(img,[match.point.x + 164, match.point.y +63, 131, 113])
        myLog('怪物名字: ' + enemyName)
        //todo 如果和quest中的目标一致就 上车
        myClick(match.point.x + iconConfig.getInBusIcon.offSet.x ,match.point.y + iconConfig.getInBusIcon.offSet.y, 300,"click get in bus icon")
        return new SuccessResult('GetInBus')
      });
    }
    myClick(pointConfig.unionIcon.x,pointConfig.unionIcon.y, 400,"ClickUnionIcon")
    return new SuccessResult('ClickUnionIcon')
  }
}
export class ToRallyWindow implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.unionIcon.x,pointConfig.unionIcon.y, 400,"ClickUnionIcon")
    myClick(pointConfig.warIcon.x,pointConfig.warIcon.y, 400,"ClickWarIcon")
    let result = findMultiColor(captureScreen(), colorConfig.rallyNoBusWindow)
    if(result != null) {
      myClick(pointConfig.rallyNoBusWindowCloseBtn.x,pointConfig.rallyNoBusWindowCloseBtn.y, 200,"click rallyNoBusWindowCloseBtn")
      new ToWorld().execute(characterState, functionConfig)
      return new FailureResult('no bus found')
    }
    return new SuccessResult('ToRallyWindow')
  }
}


export class ClickConfirmBattleBtn implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.confirmBattleBtn.x,pointConfig.confirmBattleBtn.y, 200,"ClickConfirmBattleBtn")
    return new SuccessResult('ClickConfirmBattleBtn')
  }
}

export class ClickOneClickBattle implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.oneClickBattleBtn.x,pointConfig.oneClickBattleBtn.y, 200,"ClickOneClickBattle")
    return new SuccessResult('ClickOneClickBattle')
  }
}

export class SelectResourceFieldTab implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.searchResourceTab.x, pointConfig.searchResourceTab.y, 400,"SelectResourceFieldTab")
    return new SuccessResult('SelectResourceFieldTab')
  }
}

export class ClickFarmlandPic implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.searchFarmLandPic.x, pointConfig.searchFarmLandPic.y, 400,"ClickFarmlandPic")
    return new SuccessResult('ClickFarmlandPic');
  }
}

export class SelectSearchLevel implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    for (let i = 0; i < 5; i++) {
      myClick(pointConfig.searchLevelPlusIcon.x, pointConfig.searchLevelPlusIcon.y, 50,"SelectSearchLevel")
    }
    return new SuccessResult('SelectSearchLevel');
  }
}

export class ClickFocusPoint implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.focusPoint.x, pointConfig.focusPoint.y, 1000,"ClickFocusPoint")
    return new SuccessResult('ClickFocusPoint');
  }
}

export class ClickConfirmSearchBtn implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myClick(pointConfig.searchConfirmSearchBtn.x, pointConfig.searchConfirmSearchBtn.y, 500,"ClickConfirmSearchBtn")
    return new SuccessResult('ClickConfirmSearchBtn');
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
        myClick(pointConfig.coinBar.x,pointConfig.coinBar.y, 400, "coinBar")
        mySwipe(560,700,580,500)
        myClick(pointConfig.coinHarvester.x, pointConfig.coinHarvester.y, 800, "coinHarvester")
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
          myClick(checkFree.x, checkFree.y,400, "fastHarvest checkFree")
          closeDialog()
          return new SuccessResult("fast harvest")
        }
      }
      //关闭窗口
      closeDialog()
      return new FailureResult("fast harvest failure")
    }
    function clickCoinHarvesterIcon() {
      myClick(pointConfig.focusPoint.x, pointConfig.focusPoint.y - 90, 400, "clickCoinHarvesterIcon")
    }
  }
}


function handleBackButton() {
  myLog("handleBackButton")
  let backBtn = hasBackBtn()
  if (backBtn) {
    //[25,8,84,70]
    myClick(backBtn.x + iconConfig.backBtn.offSet.x, backBtn.y + iconConfig.backBtn.offSet.y, 400, "backBtn");
    myLog("click backBtn")
    handleBackButton();
  }
}

function handleCloseBtn(){
  myLog("handleCloseBtn")
  let closeBtn = hasCloseBtn()
  if(closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + 22, closeBtn.y + 22, 400, "closeBtn")
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
  myClick(pointConfig.mainCityWorldBtn.x, pointConfig.mainCityWorldBtn.y, 800, "clickMainCityBtnOrWorldBtn")
}

function closeDialog(): ExecuteResult {
  let closeBtn = hasCloseBtn()
  if(closeBtn != null) {
    // [630,119,675,163]
    myClick(closeBtn.x + iconConfig.closeBtn.offSet.x, closeBtn.y + iconConfig.closeBtn.offSet.y, 400, "closeBtn")
    myLog("click closeBtn")
    return new SuccessResult("closeDialog")
  }
  return new FailureResult("closeDialog")
}
