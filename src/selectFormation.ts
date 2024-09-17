import {captureScreen, clickPoint, fromBase64, matchTemplate} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {RallyHuntQuest, SoloHuntQuest} from "./hunt"
import {Step} from "./core/step";
import {ExecuteResult, Failure, SuccessResult} from "./core/executeResult";
import {GetInBusQuest} from "./getInBus";
import {iconConfig} from "./config/iconConfig";
import {HuntType} from "./enum"

export class SelectCommanderSolider extends Step {
  execute(): ExecuteResult {
    //根据配置文件,决定选择哪个快捷编队,或是单兵,又或是一键
    if(this.quest instanceof SoloHuntQuest){
      this.selectFormation(this.quest.getFunctionConfig.soloHunt.formationNum);
      if(!this.heroIsSelected()){
        clickPoint(pointConfig.exitBattleBtn)
        clickPoint(pointConfig.exitBattleConfirmBtn)
        throw new Failure("SelectCommanderSolider: no hero has been selected.")
      }
    }else if(this.quest instanceof RallyHuntQuest){
      //在搜怪步骤 用的是 expectObject[0] ,所以这里也是
      let rallyHuntQuest = this.quest as RallyHuntQuest
      let huntType = rallyHuntQuest.expectObject()[0].type;
      switch (huntType){
        case HuntType.chuizi:
          this.selectFormation(this.quest.getFunctionConfig.rallyHunt.chuizi.formationNum);
          break;
        case HuntType.juxing:
          this.selectFormation(this.quest.getFunctionConfig.rallyHunt.juxing.formationNum);
          break;
        case HuntType.right:
          this.selectFormation(this.quest.getFunctionConfig.rallyHunt.right.formationNum);
          break;
        default:
          throw new Error('huntType: ${huntType} 不支持集结' );
      }
      if(!this.heroIsSelected()){
        clickPoint(pointConfig.exitBattleBtn)
        clickPoint(pointConfig.exitBattleConfirmBtn)
        throw new Failure("SelectCommanderSolider: Hero has not been selected.")
      }
    }else if(this.quest instanceof GetInBusQuest) {
      this.selectFormation(this.quest.getFunctionConfig.getInBus.formationNum);
    }
    return new SuccessResult("SelectCommanderSolider")
  }

  private heroIsSelected(): boolean {
   let matchingResult =  matchTemplate(captureScreen(),fromBase64(iconConfig.heroSelectBlank.base64))
    if(matchingResult.points.length > 0){
      return false;
    }
    return true;
  }

  private selectFormation(formationNum) {
    // if (typeof formationNum !== 'number') {
    //   throw new Error(`formationNum must be a number, but got ${typeof formationNum}`);
    // }
    let formationInt = parseInt(formationNum.toString()) //todo 这里workaround下,后续解决.
    switch (formationInt) {
      case 1:
        clickPoint(pointConfig.formationNum1)
        break;
      case 2:
        clickPoint(pointConfig.formationNum2)
        break;
      case 3:
        clickPoint(pointConfig.formationNum3)
        break;
      case 4:
        clickPoint(pointConfig.formationNum4)
        break;
      case 5:
        clickPoint(pointConfig.formationNum5)
        break;
      case 6:
        clickPoint(pointConfig.formationNum6)
        break;
      case 7:
        clickPoint(pointConfig.formationNum7)
        break;
      case 8:
        clickPoint(pointConfig.formationNum8)
        break;
      default:
        throw new Error(`SelectCommanderSolider: formationNum: ${formationNum} is not in range 1-8. `)
    }
  }
}