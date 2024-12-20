import {myClick, myLog} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {SelectCommanderSolider} from "./selectFormation"
import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {Quest} from "./core/quest";
import {HuntType} from "./enum";
import {ClickSearch, Step, ToWorld} from "./core/step";
import {ClickConfirmBattleBtn} from "./clickConfirmBattleBtn";
import {AttackEnemy} from "./steps";
export class SoloHuntQuest extends Quest {
  public actualObject: {name: HuntType, times: number} |null = null
  public weight = 6;
  protected steps = [
    new ToWorld(this),
    new ClickSearch(this),
    new SelectSoloEnemy(this),
    new AttackEnemy(this),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
  ]

  postExecute(): ExecuteResult {
    this.functionConfig.soloHunt.times -= 1;
    return new SuccessResult("postExecute SoloHuntQuest");
  }
}

export class RallyHuntQuest extends Quest {
  public actualObject: {type: HuntType, times: number} |null = null
  public weight = 5;
  protected steps = [
    new ToWorld(this),
    new ClickSearch(this),
    new SelectRallyEnemy(this),
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

  public configMatched(): boolean {
    return this.expectObject().length > 0;
  }

  postExecute(): ExecuteResult {
    if(this.actualObject == null) {
      return new SuccessResult("postExecute RallyHuntQuest actualObject is null");
    }
    switch (this.actualObject.type) {
      case HuntType.chuizi:
        this.functionConfig.rallyHunt.chuizi.times -= 1;
        break;
      case HuntType.juxing:
        this.functionConfig.rallyHunt.juxing.times -= 1;
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
  execute(): ExecuteResult {
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
      case HuntType.navy:  //todo workaround
        break;
      case HuntType.army:
        break;
      case HuntType.airForce:
        break;
    }
    myClick(pointConfig.searchConfirmSearchBtn.x, pointConfig.searchConfirmSearchBtn.y)
    myClick(pointConfig.targetCenter.x, pointConfig.targetCenter.y)

    if(this.quest.getFunctionConfig.soloHunt.attackType === "5连"){
      myClick(pointConfig.attack5TimesBtn.x, pointConfig.attack5TimesBtn.y)
    }else {
      myClick(pointConfig.attack1TimeBtn.x, pointConfig.attack1TimeBtn.y)
    }
    // myClick(pointConfig.searchAttackBtn.x, pointConfig.searchAttackBtn.y)
    return new SuccessResult('SelectSoloEnemy')
  }
}


export class SelectRallyEnemy extends Step {

  execute(): ExecuteResult {
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

    myClick(pointConfig.searchConfirmSearchBtn.x, pointConfig.searchConfirmSearchBtn.y)
    myClick(pointConfig.targetCenter.x, pointConfig.targetCenter.y)

    myClick(pointConfig.attack1TimeBtn.x, pointConfig.attack1TimeBtn.y+5);

    (this.quest as RallyHuntQuest).actualObject = {type: type, times: 1}
    return new SuccessResult('SelectRallyEnemy')
  }
}
