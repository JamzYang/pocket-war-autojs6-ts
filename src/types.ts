import {
  AttackEnemy,
  ClickCoinPoll, ClickConfirmBattleBtn,
  ClickConfirmGatherBtn,
  ClickConfirmSearchBtn,
  ClickFarmlandPic,
  ClickFocusPoint, ClickOneClickBattle,
  ClickSearch, GetInBus,
  SelectCommanderSolider,
  SelectResourceFieldTab,
  SelectSearchLevel,
  SelectSoloEnemy,
  Step,
  ToCity,
  ToCoinHarvester, ToRallyWindow,
  ToWorld
} from "./steps";
import * as console from "console";
import {myLog} from "./autoHandler";

export enum HuntType {
  Normal = 'normal',
  Elite = 'elite'
}

export interface CharacterState {
  stamina: number; // 体力
  totalTeams: number; // 队伍总数量
  idleTeams: number; // 空闲队伍
  lastCoinCollectionTime: Date; // 上次收集金币的时间
}

export interface FunctionConfig {
  collectCoins: boolean; // 收集金币开关
  gatherFood: boolean; // 采集粮食开关
  soloHunt: {
    enabled: boolean; // 单独打野开关
    type: HuntType; // 打普通怪或精英怪
    level: number; // 怪的等级. 最高级降低级数
    formationNum: number
  },
  rallyHunt: {
    enabled: boolean; // 集结打野开关
    type: HuntType; // 打普通怪或精英怪
    level: number; // 怪的等级. 最高级降低级数
    formationNum: number
  },
  getInBus: {
    enabled: boolean,
    chuizi: {
      enabled: boolean,
      times: number,
    },
    nanmin: {
      enabled: boolean,
      times: number,
    },
    heijun: {
      enabled: boolean,
      times: number,
    },
    formationNum: number
  }

}

export type Rule = (characterState: CharacterState, functionConfig: FunctionConfig) => Quest | null;

export class ExecuteResult {
  message: string;
  constructor(msg: string) {
    this.message = msg;
  }
};

export class SuccessResult extends ExecuteResult{

}

export class FailureResult extends ExecuteResult{

}

export class NeedRepeatFailureResult extends FailureResult{
  repeatSeconds: number;
  constructor(error: string, repeatSeconds: number) {
    super(error);
    this.repeatSeconds =repeatSeconds;
  }
}



export  class Quest {
  protected steps: Step[] = [];
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myLog(`Executing Quest ${this.constructor.name}`);
    let actionResult: ExecuteResult
    for (const step of this.steps) {
      myLog(`Executing step: ${step.constructor.name}`);
      actionResult = step.execute(characterState, functionConfig);
      if (actionResult instanceof FailureResult) {
        //the current time in seconds
        const repeatStartTime = new Date().getTime();
        if(actionResult instanceof NeedRepeatFailureResult) {
          actionResult = step.execute(characterState, functionConfig);
          while (actionResult instanceof NeedRepeatFailureResult
          && new Date().getTime() - repeatStartTime < actionResult.repeatSeconds * 1000) {
            actionResult = step.execute(characterState, functionConfig);
          }
        }
        myLog(`Executing step: ${step.constructor.name} failed. reason: ${actionResult.message}`)
        return actionResult;
      }
    }
    return new SuccessResult(`action: ${this.constructor.name} success`);
  }
}

export class NullQuest extends Quest {
}

export class SoloHuntQuest extends Quest {
  protected steps = [
    new ToWorld(),
    new SelectSoloEnemy(),
    new AttackEnemy(),
    new SelectCommanderSolider(),
    // new GoFight()
  ]
}

export class GatherFoodQuest extends Quest {
  protected steps = [
      new ToWorld(),
      new ClickSearch(),
      new SelectResourceFieldTab(),
      new ClickFarmlandPic(),
      new SelectSearchLevel(),
      new ClickConfirmSearchBtn(),
      new ClickFocusPoint(),
      new ClickConfirmGatherBtn(),
      new ClickOneClickBattle(),
      // new GatherResource(),
      // new SelectCommanderSolider(),
      new ClickConfirmBattleBtn()
  ]
}

/**
 * 注意: 点收割机时 有可能弹出未达到最佳领取状态的提示窗
 */
export class CollectCoinsQuest extends Quest {
  protected steps = [new ToCity(),new ToCoinHarvester(), new ClickCoinPoll()]

}

export class GetInBusQuest extends Quest {
  protected steps = [
    new ToWorld(),
    new ToRallyWindow(),
    new GetInBus(),
    new SelectCommanderSolider(),
    new ClickConfirmBattleBtn()
  ]
}


export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
  GetInBusQuest: GetInBusQuest,
};