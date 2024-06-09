import {CharacterState, ExecuteResult, FunctionConfig, Quest, SuccessResult} from "./types";
import {myClick} from "./autoHandler";
import {pointConfig} from "./config/pointConfig";
import {Step} from "./steps";
import {RallyHuntQuest, SoloHuntQuest} from "./hunt"
import {GetInBusQuest} from './types'
export class SelectCommanderSolider implements Step {
  protected quest: Quest;
  constructor(quest: Quest) {
    this.quest = quest;
  }
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    //根据配置文件,决定选择哪个快捷编队,或是单兵,又或是一键
    myClick(pointConfig.formationNum2.x, pointConfig.formationNum2.y)
    if(this.quest instanceof SoloHuntQuest){
      this.selectFormation(functionConfig.soloHunt.formationNum);
    }else if(this.quest instanceof RallyHuntQuest){
      this.selectFormation(functionConfig.rallyHunt.formationNum);
    }else if(this.quest instanceof GetInBusQuest) {
      this.selectFormation(functionConfig.getInBus.formationNum);
    }
    return new SuccessResult("SelectCommanderSolider")
  }



  private selectFormation(formationNum: number) {
    switch (formationNum) {
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
        throw new Error("SelectCommanderSolider: formationNum is not in range 1-8")
    }
  }
}