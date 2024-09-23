import {captureScreen, clickPoint, fromBase64, matchTemplate} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {RallyHuntQuest, SoloHuntQuest} from "./hunt"
import {Step} from "./core/step";
import {ExecuteResult, Failure, NoHeroSelectedError, SuccessResult} from "./core/executeResult";
import {GetInBusQuest} from "./getInBus";
import {iconConfig} from "./config/iconConfig";
import {HuntType} from "./enum"
import {heroIsSelected, selectFormation} from "./helper/stepHelper"

export class SelectCommanderSolider extends Step {
  execute(): ExecuteResult {
    //根据配置文件,决定选择哪个快捷编队,或是单兵,又或是一键
    if(this.quest instanceof SoloHuntQuest){
      selectFormation(this.quest.getFunctionConfig.soloHunt.formationNum);
      if(!heroIsSelected()){
        clickPoint(pointConfig.exitBattleBtn)
        clickPoint(pointConfig.exitBattleConfirmBtn)
        throw new NoHeroSelectedError("no hero has been selected.")
      }
    }else if(this.quest instanceof RallyHuntQuest){
      //在搜怪步骤 用的是 expectObject[0] ,所以这里也是
      let rallyHuntQuest = this.quest as RallyHuntQuest
      let huntType = rallyHuntQuest.expectObject()[0].type;
      switch (huntType){
        case HuntType.chuizi:
          selectFormation(this.quest.getFunctionConfig.rallyHunt.chuizi.formationNum);
          break;
        case HuntType.juxing:
          selectFormation(this.quest.getFunctionConfig.rallyHunt.juxing.formationNum);
          break;
        case HuntType.right:
          selectFormation(this.quest.getFunctionConfig.rallyHunt.right.formationNum);
          break;
        default:
          throw new Error('huntType: ${huntType} 不支持集结' );
      }
      if(!heroIsSelected()){
        clickPoint(pointConfig.exitBattleBtn)
        clickPoint(pointConfig.exitBattleConfirmBtn)
        throw new NoHeroSelectedError("SelectCommanderSolider: Hero has not been selected.")
      }
    }else if(this.quest instanceof GetInBusQuest) {
      selectFormation(this.quest.getFunctionConfig.getInBus.formationNum);
    }
    return new SuccessResult("SelectCommanderSolider")
  }




}