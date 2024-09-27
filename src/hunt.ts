import {captureScreen, clickPoint, findImage, fromBase64, myClick, myLog, mySwipe} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import {SelectCommanderSolider} from "./selectFormation"
import {ExecuteResult, FailureResult, SuccessResult} from "./core/executeResult";
import {Quest} from "./core/quest";
import {HuntType} from "./enum";
import {ClickSearch, Step, ToWorld} from "./core/step";
import {ClickConfirmBattleBtn} from "./clickConfirmBattleBtn";
import {AttackEnemy} from "./steps";
import {intervalConfig} from "./config/intervalConfig";
export class SoloHuntQuest extends Quest {
  public name: string = "单刷";
  public actualObject: {name: HuntType, times: number} |null = null
  public weight = 1;
  protected steps = [
    new ToWorld(this),
    new ClickSearch(this),
    new SelectSoloEnemy(this),
    new SelectHuntLevel(this),
    new AttackEnemy(this),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
  ]

  postExecute(questResult: ExecuteResult) {
    //任务执行异常时 返回的不是 FailureResult?
    if(questResult instanceof FailureResult) {
      return;
    }
    this.functionConfig.soloHunt.times -= 1;
    myLog(`${this.name} 剩余执行次数 ${this.functionConfig.soloHunt.times}`)
    return new SuccessResult("postExecute SoloHuntQuest");
  }
}

export class RallyHuntQuest extends Quest {
  public name: string = "集结";
  public actualObject: {type: HuntType, times: number} |null = null
  public weight = 1;
  protected steps = [
    new ToWorld(this),
    new ClickSearch(this),
    new SelectRallyEnemy(this),
    new SelectHuntLevel(this),
    new AttackEnemy(this),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
  ]

  public expectObject(): {type: HuntType, times: number}[] {
    let huntTypes:{type: HuntType, times: number}[]  = [];
    if(this.functionConfig.rallyHunt.chuizi.enabled && this.functionConfig.rallyHunt.chuizi.times >= 0){
      huntTypes.push({type: HuntType.chuizi, times: this.functionConfig.rallyHunt.chuizi.times})
    }
    if(this.functionConfig.rallyHunt.juxing.enabled && this.functionConfig.rallyHunt.juxing.times >= 0){
      huntTypes.push({type: HuntType.juxing, times: this.functionConfig.rallyHunt.juxing.times})
    }
    if(this.functionConfig.rallyHunt.nanmin.enabled && this.functionConfig.rallyHunt.nanmin.times >= 0){
      huntTypes.push({type: HuntType.nanmin, times: this.functionConfig.rallyHunt.nanmin.times})
    }
    if(this.functionConfig.rallyHunt.right.enabled && this.functionConfig.rallyHunt.right.times >= 0){
      huntTypes.push({type: HuntType.right, times: this.functionConfig.rallyHunt.right.times})
    }
    return huntTypes
  }

  //todo 不明白 集结为啥要 重写这个方法
  // public configMatched(): boolean {
  //   return super.configMatched() && this.expectObject().length > 0;
  // }

  postExecute(questResult: ExecuteResult) {
    if(this.actualObject == null) {
      myLog("postExecute RallyHuntQuest actualObject is null");
      return;
    }
    if(questResult instanceof FailureResult) {
      return;
    }
    switch (this.actualObject.type) {
      case HuntType.chuizi:
        this.functionConfig.rallyHunt.chuizi.times -= 1;
        myLog(`${this.name} ${this.actualObject.type} 剩余执行次数 ${this.functionConfig.rallyHunt.chuizi.times}`)

        break;
      case HuntType.juxing:
        this.functionConfig.rallyHunt.juxing.times -= 1;
        myLog(`${this.name} ${this.actualObject.type} 剩余执行次数 ${this.functionConfig.rallyHunt.juxing.times}`)
        break;
      case HuntType.nanmin:
        this.functionConfig.rallyHunt.nanmin.times -= 1;
        break;
      case HuntType.right:
        this.functionConfig.rallyHunt.right.times -= 1;
        break;
    }
    return new SuccessResult("postExecute RallyHuntQuest");
  }
}


export class SelectSoloEnemy extends Step {
  private swipeLeft = () => {
    mySwipe(140,800,500,800,1000,1000)
  }
  private swipeRight = () => {
    mySwipe(600,800,300,800,1000,1000)
  }

  execute() {
    myClick(pointConfig.searchSoloEnemyTab.x, pointConfig.searchSoloEnemyTab.y, 600, "SelectSoloEnemyTab")

    // const typeKey = Object.keys(HuntType).find(key => HuntType[key as keyof typeof HuntType] === type);
    let huntType = HuntType[this.quest.getFunctionConfig.soloHunt.type.toString() as keyof typeof HuntType];
    switch (huntType) {
      case HuntType.byTurn: //todo workaround
        let lastQuest = this.quest.getCharacterState.lastQuests.get(this.quest.constructor.name);
        if(lastQuest){
          let lastSolo =  lastQuest as SoloHuntQuest
          myLog("lastQuest==>" + JSON.stringify(lastSolo.actualObject))
          if(lastSolo.actualObject?.name == HuntType.army) {
            myClick(pointConfig.searchSecondCell.x, pointConfig.searchSecondCell.y);
            (this.quest as SoloHuntQuest).actualObject = {name: HuntType.navy, times: 1}
          }else if(lastSolo.actualObject?.name == HuntType.navy){
            myClick(pointConfig.searchThirdCell.x, pointConfig.searchThirdCell.y);
            (this.quest as SoloHuntQuest).actualObject = {name: HuntType.airForce, times: 1}
          }else {
            myClick(pointConfig.searchFirstCell.x, pointConfig.searchFirstCell.y);
            (this.quest as SoloHuntQuest).actualObject = {name: HuntType.army, times: 1}
          }
        }
        break;
      case HuntType.left1:
        this.swipeLeft()
        myClick(140,800)
        break;
      case HuntType.left2:
        this.swipeLeft()
        myClick(370,800)
        break;
      case HuntType.left3:
        this.swipeLeft()
        myClick(600,800)
        break;
      case HuntType.right1:
        this.swipeRight()
        myClick(600,800)
        break;
      case HuntType.right2:
        this.swipeRight()
        myClick(370,800)
    }
    return new SuccessResult('SelectSoloEnemy')
  }
}


export class SelectRallyEnemy extends Step {

  execute() {
    myClick(pointConfig.searchRallyEnemyTab.x, pointConfig.searchRallyEnemyTab.y, 600, "SelectSoloEnemyTab")
    let expectObject = (this.quest as RallyHuntQuest).expectObject();
    let type = expectObject[0].type;
    switch (type) {
      case HuntType.chuizi:
        myClick(pointConfig.searchFirstCell.x, pointConfig.searchFirstCell.y)
        break;
      case HuntType.juxing:
        myClick(pointConfig.searchSecondCell.x, pointConfig.searchSecondCell.y)
        break;
      case HuntType.right:
        // myClick(pointConfig.searchSecondCell.x, pointConfig.searchSecondCell.y)
        // break;
        throw new Error('right not implemented')
      }

    // myClick(pointConfig.attack1TimeBtn.x, pointConfig.attack1TimeBtn.y+5);
    if(this.quest instanceof RallyHuntQuest) {
      this.quest.actualObject = {type: type, times: 1}
    }
    // (this.quest as RallyHuntQuest).actualObject = {type: type, times: 1}
    return new SuccessResult('SelectRallyEnemy')
  }
}

class SelectHuntLevel extends Step {
  execute() {
    let result = findImage(captureScreen(),fromBase64(iconConfig.highestLevelHunt.base64))
    if(result == null) {
      let clickTimes = 0;
      while(clickTimes < 6 ) {
        clickPoint(pointConfig.searchLevelPlusIcon)
        clickTimes ++
      }
    }
    clickPoint(pointConfig.searchConfirmSearchBtn,1000)
    clickPoint(pointConfig.targetCenter)
    return new SuccessResult("SelectHuntLevel")
  }
}