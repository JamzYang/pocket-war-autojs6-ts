import {Quest} from "./core/quest";
import {Step, ToWorld} from "./core/step";
import {ExecuteResult, SuccessResult} from "./core/executeResult";

import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {myClick} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {SelectCommanderSolider} from "./selectFormation";
import {ClickConfirmBattleBtn} from "./clickConfirmBattleBtn";
import {ClickFocusPoint, ClickMidAttackPoint} from "./steps";


export class MechQuest extends Quest {
  public weight = 6;
  protected steps = [
    new ToWorld(this),
    new ToMech(this),
    new CheckMechIsOpen(this),
      //todo 根据机甲状态动态添加steps
    // new Donate(),
    // new Fight(),
    // new SelectCommanderSolider(this),
    // new ClickConfirmBattleBtn(this),
  ]
}

export class ToMech extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.unionIcon.x,pointConfig.unionIcon.y)
    myClick(pointConfig.unionEventIcon.x,pointConfig.unionEventIcon.y)
    myClick(pointConfig.unionEventMechs.x,pointConfig.unionEventMechs.y)
    return new SuccessResult('ToMech');
  }
}

class CheckMechIsOpen extends Step {
  execute(): ExecuteResult {
    if(!this.mechIsOpened()){
      return new SuccessResult('mech has not opened');
    }
    this.quest.addStep(new canDonate(this.quest))
    return new SuccessResult('MechIsOpen');
  }

  private mechIsOpened() {
    return false; //todo
  }
}

class canDonate extends Step {
  execute(): ExecuteResult {
    if(this.isDonating()){
      this.quest.addStep(new Donate(this.quest))
    }else if(this.isChallenging()) {
      this.quest.addStep(new Challenge(this.quest))
      this.quest.addStep(new ClickFocusPoint(this.quest))
      this.quest.addStep(new CanAttack(this.quest))

    }else {
      throw new Error('canDonate');
    }
    return new SuccessResult('canDonate');
  }

  private isDonating() {
    return false; //todo
  }

  private isChallenging() {
    return false; //todo
  }
}

class Donate extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.unionMechDonateBtn.x,pointConfig.unionMechDonateBtn.y)
    return new SuccessResult('Donate');
  }
}

class Challenge extends Step {
  execute(): ExecuteResult {
    //挑战btn和捐献btn位置相同
    myClick(pointConfig.unionEventIcon.x,pointConfig.unionEventIcon.y)
    return new SuccessResult('Challenge');
  }
}
class CanAttack extends Step {
  execute(): ExecuteResult {
    if(this.canAttack()){
      this.quest.addStep(new ClickMidAttackPoint(this.quest))
      this.quest.addStep(new SelectCommanderSolider(this.quest)) //todo 机甲选队
      this.quest.addStep(new ClickConfirmBattleBtn(this.quest))
    }
    return new SuccessResult('Challenge');
  }

  private canAttack() {
    return false; //todo
  }
}