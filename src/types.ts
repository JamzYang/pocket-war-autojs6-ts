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
import {repeatSeconds} from "./config/env.conf";

export enum HuntType {
  Normal = 'normal',
  Elite = 'elite'
}

export enum EnemyName {
  Chuizi = '战锤',
  Heijun = '黑暗军团',
  Nanmin = '难民',
  Juxing = '惧星',
  Pengpeng = '砰砰',
  Jingwei = '黑暗精卫',
  Shouwei = '守卫',
  Null = '无',
}


export interface Context {
  state: CharacterState; // 体力
  config: FunctionConfig; // 队伍总数量
  currentQuest: Quest; // 空闲队伍
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
    juxing: {
      enabled: boolean,
      times: number,
    },
    formationNum: number
  }

}

export class ExecuteResult {
  message: string;
  constructor(msg: string) {
    this.message = msg;
  }
};

export class SuccessResult extends ExecuteResult{

}

export class Failure extends Error{

}

export class NeedRepeatFailure extends Failure{
  repeatSeconds: number;
  constructor(error: string, repeatSeconds: number) {
    super(error);
    this.repeatSeconds =repeatSeconds;
  }
}



export  class Quest {
  protected steps: Step[] = [];
  weight: number = 0;
  postExecute (characterState: CharacterState, functionConfig: FunctionConfig):ExecuteResult {
   return  new SuccessResult('success')
  }

  configMatched(characterState: CharacterState, functionConfig: FunctionConfig): boolean {
    return true;
  }

  execute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    myLog(`Executing Quest ${this.constructor.name}`);
    let actionResult: ExecuteResult
    for (const step of this.steps) {
      myLog(`Executing step: ${step.constructor.name}`);
      const stepFirstStartTime = new Date().getTime();
      try {
        actionResult = step.execute(characterState, functionConfig);
      }catch (e){
        if(e instanceof NeedRepeatFailure){
          if(new Date().getTime() - stepFirstStartTime < repeatSeconds() * 1000) {
            actionResult = step.execute(characterState, functionConfig);
          }else {
            myLog(`Executing step: ${step.constructor.name} repeat time out. ${e}`)
          }
        }else {
          myLog(`Executing step: ${step.constructor.name} error.  ${e}`)
          throw e
        }
      }
    }
    return new SuccessResult(`action: ${this.constructor.name} success`);
  }
}

export class NullQuest extends Quest {
}

export class SoloHuntQuest extends Quest {
  weight = 6;
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


interface EnemyObject {
  name: EnemyName;
  times: number;
}

export class GetInBusQuest extends Quest {

  public expectObject(characterState: CharacterState, functionConfig: FunctionConfig): {name: EnemyName, times: number}[] {
    let enemyNames:{name: EnemyName, times: number}[]  = [];
    if(functionConfig.getInBus.chuizi.enabled && functionConfig.getInBus.chuizi.times >= 0){
      enemyNames.push({name: EnemyName.Chuizi, times: functionConfig.getInBus.chuizi.times})
    }
    if(functionConfig.getInBus.heijun.enabled && functionConfig.getInBus.heijun.times >= 0){
      enemyNames.push({name: EnemyName.Heijun, times: functionConfig.getInBus.heijun.times})
    }
    if(functionConfig.getInBus.nanmin.enabled && functionConfig.getInBus.nanmin.times >= 0){
      enemyNames.push({name: EnemyName.Nanmin, times: functionConfig.getInBus.nanmin.times})
    }
    if(functionConfig.getInBus.juxing.enabled && functionConfig.getInBus.juxing.times >= 0){
      enemyNames.push({name: EnemyName.Juxing, times: functionConfig.getInBus.juxing.times})
    }
    return enemyNames
  }
  public configMatched(characterState: CharacterState, functionConfig: FunctionConfig): boolean {
    return this.expectObject(characterState, functionConfig).length > 0;
  }

  weight = 5;
  protected steps = [
    new ToWorld(),
    new ToRallyWindow(),
    new GetInBus(this),
    new SelectCommanderSolider(),
    new ClickConfirmBattleBtn()
  ]

  /**
   * times字段暂时好像没啥用 //todo
   */
  actualObject: {name: EnemyName, times: number} |null = null

  //重写postExecute方法
  postExecute(characterState: CharacterState, functionConfig: FunctionConfig): ExecuteResult {
    if(this.actualObject == null) {
      return new SuccessResult("postExecute GetInBusQuest actualObject is null");
    }
    switch (this.actualObject.name) {
      case EnemyName.Chuizi:
        functionConfig.getInBus.chuizi.times -= 1;
        break;
      case EnemyName.Heijun:
        functionConfig.getInBus.heijun.times -= 1;
        break;
      case EnemyName.Nanmin:
        functionConfig.getInBus.nanmin.times -= 1;
      case EnemyName.Juxing:
        functionConfig.getInBus.juxing.times -= 1;
    }
    return new SuccessResult("postExecute GetInBusQuest");
  }
}


export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
  GetInBusQuest: GetInBusQuest,
};