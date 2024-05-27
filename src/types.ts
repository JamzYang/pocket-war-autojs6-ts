import {
  AttackEnemy,
  ClickCoinPoll, ClickConfirmBattleBtn,
  ClickConfirmGatherBtn,
  ClickConfirmSearchBtn,
  ClickFarmlandPic,
  ClickFocusPoint, ClickOneClickBattle,
  ClickSearch,
  SelectCommanderSolider,
  SelectResourceFieldTab,
  SelectSearchLevel,
  SelectSoloEnemy,
  Step,
  ToCity,
  ToCoinHarvester,
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
  }

}

export type Rule = (characterState: CharacterState, functionConfig: FunctionConfig) => Quest | null;


export class SuccessResult {
  message: string;
  constructor(message: string = '成功') {
    this.message = message;
  }
}

export class FailureResult {
  error: string;
  constructor(error: string) {
    this.error = error;
  }
}

export type ExecuteResult = SuccessResult | FailureResult;

export  class Quest {
  protected steps: Step[] = [];
  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myLog(`Executing Quest ${this.constructor.name}`);
    let actionResult: ExecuteResult
    for (const step of this.steps) {
      myLog(`Executing step: ${step.constructor.name}`);
      actionResult = step.execute(characterState, functionConfig);
      if (actionResult instanceof FailureResult) {
        myLog(`Executing step: ${step.constructor.name} failed. reason: ${actionResult.error}`)
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


export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
};