import {ClickCoinPoll, Step, ToCity} from "./steps";

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
  };
  rallyHunt: boolean; // 集结打野开关
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
    console.log(`Executing Quest ${this.constructor.name}`);
    let actionResult: ExecuteResult
    for (const step of this.steps) {
      console.log(`Executing step: ${step.constructor.name}`);
      actionResult = step.execute(characterState, functionConfig);
      if (actionResult instanceof FailureResult) {
        return actionResult;
      }
    }
    return new SuccessResult(`action: ${this.constructor.name} success`);
  }
}

export class NullQuest extends Quest {
}

export class SoloHuntQuest extends Quest {
  protected steps = []
}

export class GatherFoodQuest extends Quest {
  protected steps = []
}

export class CollectCoinsQuest extends Quest {
  protected steps = [new ToCity(), new ClickCoinPoll()]

}


export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
};