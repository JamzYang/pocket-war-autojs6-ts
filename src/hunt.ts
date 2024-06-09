import {myClick} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {SelectCommanderSolider} from "./selectFormation"
import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {Quest} from "./core/quest";
import {EnemyName, HuntType} from "./enum";
import {ClickConfirmBattleBtn, Step, ToWorld} from "./core/step";
import {AttackEnemy} from "./steps";
import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";

export class SoloHuntQuest extends Quest {
  public actualObject: {name: HuntType, times: number} |null = null
  public weight = 6;
  protected steps = [
    new ToWorld(),
    new SelectSoloEnemy(),
    new AttackEnemy(),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
  ]

  postExecute(): ExecuteResult {
    this.functionConfig.soloHunt.times -= 1;
    return new SuccessResult("postExecute SoloHuntQuest");
  }
}

export class RallyHuntQuest extends Quest {
  public actualObject: {name: EnemyName, times: number} |null = null
  public weight = 5;
  protected steps = [
    new ToWorld(),
    new SelectRallyEnemy(),
    new AttackEnemy(),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
  ]

  postExecute(): ExecuteResult {
    if(this.actualObject == null) {
      return new SuccessResult("postExecute RallyHuntQuest actualObject is null");
    }
    switch (this.actualObject.name) {
      case EnemyName.Chuizi:
        this.functionConfig.rallyHunt.chuizi.times -= 1;
        break;
      case EnemyName.Nanmin:
        this.functionConfig.rallyHunt.nanmin.times -= 1;
        break;
      case EnemyName.Juxing:
        this.functionConfig.rallyHunt.juxing.times -= 1;
        break;
    }
    return new SuccessResult("postExecute GetInBusQuest");
  }
}


export class SelectSoloEnemy implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    switch (functionConfig.soloHunt.type) {
      case HuntType.byTurn:
        let lastQuest = characterState.lastQuests.get(SoloHuntQuest.name)
        if(lastQuest){
          let lastSolo =  lastQuest as SoloHuntQuest
          if(lastSolo.actualObject?.name == HuntType.army) {
            myClick(pointConfig.searchMidCell.x, pointConfig.searchMidCell.y)
          }else if(lastSolo.actualObject?.name == HuntType.navy){
            myClick(pointConfig.searchRightCell.x, pointConfig.searchRightCell.y)
          }else {
            myClick(pointConfig.searchLeftCell.x, pointConfig.searchLeftCell.y)
          }
        }
        break;
      case HuntType.navy:
        break;
      case HuntType.army:
        break;
      case HuntType.airForce:
        break;
    }
    myClick(pointConfig.searchConfirmSearchBtn.x, pointConfig.searchConfirmSearchBtn.y)
    myClick(pointConfig.targetCenter.x, pointConfig.targetCenter.y)

    if(functionConfig.soloHunt.attackType === "5连"){
      myClick(pointConfig.attack5TimesBtn.x, pointConfig.attack5TimesBtn.y)
    }else {
      myClick(pointConfig.attack1TimeBtn.x, pointConfig.attack1TimeBtn.y)
    }
    // myClick(pointConfig.searchAttackBtn.x, pointConfig.searchAttackBtn.y)
    return new SuccessResult('SelectSoloEnemy')
  }
}


export class SelectRallyEnemy implements Step {
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    // switch (functionConfig.rallyHunt.type) {
    //   case HuntType.chuizi:
    //     myClick(pointConfig.searchMidCell.x, pointConfig.searchMidCell.y)
    //     let lastQuest = characterState.lastQuests.get(SoloHuntQuest.name)
    //     if(lastQuest){
    //       let lastSolo =  lastQuest as SoloHuntQuest
    //       if(lastSolo.actualObject?.name == HuntType.army) {
    //       }else if(lastSolo.actualObject?.name == HuntType.navy){
    //       }else {
    //         myClick(pointConfig.searchLeftCell.x, pointConfig.searchLeftCell.y)
    //       }
    //     }
    //     break;
    //   case HuntType.juxing:
    //     myClick(pointConfig.searchRightCell.x, pointConfig.searchRightCell.y)
    //     break;
    //   default:
    //     throw new Error("not support hunt type");
    // }
    // myClick(pointConfig.searchConfirmSearchBtn.x, pointConfig.searchConfirmSearchBtn.y)
    // myClick(pointConfig.targetCenter.x, pointConfig.targetCenter.y)
    // myClick(pointConfig.attack1TimeBtn.x, pointConfig.attack1TimeBtn.y)
    return new SuccessResult('SelectSoloEnemy')
  }
}