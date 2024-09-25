import {
  captureScreen,
  clickPoint,
  findImage,
  findMultiColor,
  fromBase64,
  myClick,
  myLog,
  mySwipe
} from "./helper/autoHandler";
import {colorConfig} from "./config/colorConfig";
import {ClickOneClickBattle, ClickSearch, Step, ToWorld} from "./core/step";
import {ClickConfirmBattleBtn} from "../src/clickConfirmBattleBtn";

import {Quest} from "./core/quest"
import {ExecuteResult, Failure, FailureResult, SuccessResult} from "./core/executeResult";
import {pointConfig} from "./config/pointConfig";
import {ClickConfirmSearchBtn, ClickFocusPoint, SelectSearchLevel,} from "./steps";
import {GatherType} from "./enum";
import {iconConfig} from "./config/iconConfig";
import {heroIsSelected, selectFormation} from "./helper/stepHelper";


export class GatherQuest extends Quest {
  public name: string = "采集";
  public weight = -1;
  protected steps = [
    new ToWorld(this),
    new ClickSearch(this),
    new SelectResourceFieldTab(this),
    new SelectResource(this),
    new SelectSearchLevel(this),
    new ClickConfirmSearchBtn(this),
    new ClickFocusPoint(this),
    new ClickGatherBtn(this),
    new SelectGatherTeam(this),
    new ClickConfirmBattleBtn(this)
  ];

  gatherType: GatherType = GatherType.Food;
  teamNum: string = "";
  formationNum: number = 0;

  preExecute(): void {
    let gatherConfig = this.functionConfig.gather;
    for (let i = 1; i <= 8; i++) {
      const teamConfig = gatherConfig[`team${i}`];
      if (teamConfig.enabled) {
        this.gatherType = teamConfig.type;
        this.formationNum = teamConfig.formationNum
        this.teamNum = `team${i}`;
        break;
      }
    }
  }

  postExecute(questResult: ExecuteResult): void {
    if (questResult instanceof SuccessResult) {
      // 将相应 team 的 enable 属性赋为 false
      const teamConfig = this.functionConfig.gather[this.teamNum];
      if (teamConfig) {
        teamConfig.enabled = false;
      }
    }
  }
}

export class SelectResourceFieldTab extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.searchResourceTab.x, pointConfig.searchResourceTab.y, 800, "SelectResourceFieldTab")
    return new SuccessResult('SelectResourceFieldTab')
  }
}

export class SelectResource extends Step {
  execute(): ExecuteResult {
    let gatherQuest = this.quest as GatherQuest;
    myLog(`采集类型为${gatherQuest.gatherType}`)
    switch (gatherQuest.gatherType){
      case GatherType.Food:
        clickPoint(pointConfig.searchTabRightPos)
        break;
      case GatherType.Oil:
        clickPoint(pointConfig.searchTabMidPos)
        break;
      case GatherType.Thor:
        this.swipeRight()
        clickPoint(pointConfig.searchTabRightPos)
        break;
    }
    return new SuccessResult('SelectResource');
  }


  private swipeRight = () => {
    mySwipe(600,800,300,800,1000,1000)
  }
}

export class ClickGatherBtn extends Step {
  execute(): ExecuteResult {
    let gatherQuest = this.quest as GatherQuest;
    // if (this.isBuildMechanical(gatherQuest.gatherType)){
    //
    // }
    let result = findImage(
        captureScreen(),fromBase64(iconConfig.confirmGatherBtn.base64),
        {threshold:0.7, region:[100,400,600,600]}
    )
    if(result) {
      myClick(result.x, result.y + 30,1000)
    }else {
      myLog("未找到采集按钮. 点击默认的设置")

      //todo 没找到采集 的逻辑暂时不写
    }
    return new SuccessResult('ClickFocusPoint');
  }

  private isBuildMechanical = (gatherType: GatherType) =>{
    return  GatherType.BuildMechanicalFood == gatherType || GatherType.BuildMechanicalOil == gatherType
  }
}

export class SelectGatherTeam extends Step{
  execute(): ExecuteResult {
    let gatherQuest = this.quest as GatherQuest;
    selectFormation(gatherQuest.formationNum)
    if(!heroIsSelected) {
      throw new FailureResult("没有选择英雄")
    }
    return new SuccessResult("SelectGatherTeam")
  }
}