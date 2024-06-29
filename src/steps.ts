import {
  captureScreen, findImage,
  findMultiColor,
  fromBase64,
  matchTemplate,
  myClick,
  myLog,
  mySleep,
  mySwipe
} from "./helper/autoHandler";
import {colorConfig} from "./config/colorConfig";
import {iconConfig} from "./config/iconConfig";
import {pointConfig} from "./config/pointConfig";
import {Step} from "./core/step";
import {CharacterState} from "./core/characterState";
import {FunctionConfig} from "./core/functionConfig";
import {ExecuteResult,SuccessResult,Failure} from "./core/executeResult";







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
    //根据配置文件,攻击几次或是集结
    // throw new Error('Method not implemented.');
    return new SuccessResult("AttackEnemy")
  }
}











