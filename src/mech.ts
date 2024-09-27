import {Quest} from "./core/quest";
import {Step, ToWorld} from "./core/step";
import {ExecuteResult, SuccessResult} from "./core/executeResult";

import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {clickPoint} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {SelectCommanderSolider} from "./selectFormation";
import {ClickConfirmBattleBtn} from "./clickConfirmBattleBtn";
import {ClickFocusPoint} from "./steps";


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
  execute() {
    clickPoint(pointConfig.unionIcon)
    clickPoint(pointConfig.unionEventIcon)
    clickPoint(pointConfig.unionEventMechs)
    return new SuccessResult('ToMech');
  }
}

class CheckMechIsOpen extends Step {
  execute() {
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
  execute() {
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
  execute() {
    clickPoint(pointConfig.unionMechDonateBtn)
    return new SuccessResult('Donate');
  }
}

class Challenge extends Step {
  execute() {
    //挑战btn和捐献btn位置相同
    clickPoint(pointConfig.unionEventIcon)
    return new SuccessResult('Challenge');
  }
}
class CanAttack extends Step {
  execute() {
    if(this.canAttack()){
      // this.quest.addStep(new ClickMidAttackPoint(this.quest)) todo
      this.quest.addStep(new SelectCommanderSolider(this.quest)) //todo 机甲选队
      this.quest.addStep(new ClickConfirmBattleBtn(this.quest))
    }
    return new SuccessResult('Challenge');
  }

  private canAttack() {
    return false; //todo
  }
}