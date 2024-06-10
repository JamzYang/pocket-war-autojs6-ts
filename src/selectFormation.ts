import {myClick, myLog} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {RallyHuntQuest, SoloHuntQuest} from "./hunt"
import {Step} from "./core/step";
import {Quest} from "./core/quest";
import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {ExecuteResult, SuccessResult} from "./core/executeResult";
import {GetInBusQuest} from "./getInBus";
export class SelectCommanderSolider implements Step {
  protected quest: Quest;
  constructor(quest: Quest) {
    this.quest = quest;
  }
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    //根据配置文件,决定选择哪个快捷编队,或是单兵,又或是一键
    if(this.quest instanceof SoloHuntQuest){
      myLog("formationNum ========="+ functionConfig.soloHunt.formationNum)
      this.selectFormation(functionConfig.soloHunt.formationNum);
    }else if(this.quest instanceof RallyHuntQuest){
      // this.selectFormation(functionConfig.rallyHunt.formationNum); //todo 这里要根据怪类型来选择编队
    }else if(this.quest instanceof GetInBusQuest) {
      this.selectFormation(functionConfig.getInBus.formationNum);
    }
    return new SuccessResult("SelectCommanderSolider")
  }



  private selectFormation(formationNum) {
    // if (typeof formationNum !== 'number') {
    //   throw new Error(`formationNum must be a number, but got ${typeof formationNum}`);
    // }
    let formationInt = parseInt(formationNum.toString()) //todo 这里workaround下,后续解决.
    switch (formationInt) {
      case 1:
        myClick(pointConfig.formationNum1.x, pointConfig.formationNum1.y)
        break;
      case 2:
        myClick(pointConfig.formationNum2.x, pointConfig.formationNum2.y)
        break;
      case 3:
        myClick(pointConfig.formationNum3.x, pointConfig.formationNum3.y)
        break;
      case 4:
        myClick(pointConfig.formationNum4.x, pointConfig.formationNum4.y)
        break;
      case 5:
        myClick(pointConfig.formationNum5.x, pointConfig.formationNum5.y)
        break;
      case 6:
        myClick(pointConfig.formationNum6.x, pointConfig.formationNum6.y)
        break;
      case 7:
        myClick(pointConfig.formationNum7.x, pointConfig.formationNum7.y)
        break;
      case 8:
        myClick(pointConfig.formationNum8.x, pointConfig.formationNum8.y)
        break;
      default:
        throw new Error(`SelectCommanderSolider: formationNum: ${formationNum} is not in range 1-8. `)
    }
  }
}