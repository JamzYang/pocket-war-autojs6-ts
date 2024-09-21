import {captureScreen, clickPoint, findMultiColor, myClick, myLog} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {Step} from "./core/step";
import {ExecuteResult, Failure, SuccessResult} from "./core/executeResult";
import {colorConfig} from "./config/colorConfig";
import {RallyHuntQuest, SoloHuntQuest} from "./hunt";
import {HuntType} from "./enum";

export class SelectSearchLevel extends Step {
  execute(): ExecuteResult {
    for (let i = 0; i < 5; i++) {
      myClick(pointConfig.searchLevelPlusIcon.x, pointConfig.searchLevelPlusIcon.y, 50, "SelectSearchLevel")
    }
    return new SuccessResult('SelectSearchLevel');
  }
}

export class ClickFocusPoint extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.focusPoint.x, pointConfig.focusPoint.y, 1000, "ClickFocusPoint")
    return new SuccessResult('ClickFocusPoint');
  }
}


export class ClickMidAttackPoint extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.midAttackPoint.x, pointConfig.midAttackPoint.y, 1000, "ClickMidAttackPoint")
    return new SuccessResult('ClickFocusPoint');
  }
}

export class ClickConfirmSearchBtn extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.searchConfirmSearchBtn.x, pointConfig.searchConfirmSearchBtn.y, 500, "ClickConfirmSearchBtn")
    return new SuccessResult('ClickConfirmSearchBtn');
  }
}

export class GatherResource extends Step {
  execute(): ExecuteResult {
    throw new Error('Method not implemented.');
  }
}

/**
 * 攻击几次, 集结. 对话框
 */
export class AttackEnemy extends Step {
  //判断单刷还是集结可以在创建Step时传个变量. 或者根据配置文件也可以,但是 配置中的单刷和集结得互斥
  execute(): ExecuteResult {
    //集结/攻击/攻击5次 按钮的左右偏移值
    let offset = 100;
    if(this.quest instanceof SoloHuntQuest) {
      //单刷5连在左边
      if(this.quest.getFunctionConfig.soloHunt.attackType == "五连") {
        offset = -100;
      }
    } else if(this.quest instanceof RallyHuntQuest) {
      if(this.quest.actualObject?.type == HuntType.juxing) {
        offset = -100;
      }
    }

    //由于集结惧星 找不到集结button, 暂时workaround一下.
    if(this.quest instanceof RallyHuntQuest
        && this.quest.actualObject?.type == HuntType.juxing){
      clickPoint(pointConfig.rallyJuXingBtn)
      return new SuccessResult("AttackEnemy")
    }


    //普通打野执行下面逻辑.
    // throw new Error('Method not implemented.');
    let screen = captureScreen()
    let result = findMultiColor(screen,colorConfig.rallySoloAttackBtn)
    screen.saveTo(`/sdcard/脚本/${new Date().getTime()}.png`)
    if(result){
      myClick(result.x + offset, result.y)
    }else {
      throw new Failure("未找到攻击按钮")
    }
    return new SuccessResult("AttackEnemy")
  }
}











