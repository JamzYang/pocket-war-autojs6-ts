import {
  AttackEnemy,
  CheckGetInBusSuccess,
  ClickCoinPoll,
  ClickConfirmBattleBtn,
  ClickConfirmGatherBtn,
  ClickConfirmSearchBtn,
  ClickFarmlandPic,
  ClickFocusPoint,
  ClickOneClickBattle,
  ClickSearch,
  GetInBus,
  SelectCommanderSolider,
  SelectResourceFieldTab,
  SelectSearchLevel,
  SelectSoloEnemy,
  Step,
  ToCity,
  ToCoinHarvester,
  ToRallyWindow,
  ToWorld
} from "./steps";
import {myLog} from "./autoHandler";
import {repeatSeconds} from "./config/env.conf";
import {intervalConfig} from "./config/intervalConfig";


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
  lastQuests: Map<string, Quest>;
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
  },

  events: {
    oceanTreasure: {
      enabled: boolean,
      detectorNum: number
    },
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

export class TextParseError extends  Error{

}

export class NeedRepeatFailure extends Failure{
  repeatSeconds: number;
  constructor(error: string, repeatSeconds: number) {
    super(error);
    this.repeatSeconds =repeatSeconds;
  }
}



export class Quest {
  protected characterState: CharacterState;
  protected functionConfig: FunctionConfig;
  protected steps: Step[] = [];
  public weight: number = 0;
  public nextExecuteTime: number = 0;

  /**
   * 执行周期. 单位:秒
   * @protected
   */
  protected getInterval(): number {return 0};
  constructor(characterState: CharacterState, functionConfig: FunctionConfig) {
    this.characterState = characterState;
    this.functionConfig = functionConfig;
  }

  postExecute ():ExecuteResult {
   return  new SuccessResult('success')
  }

  configMatched(): boolean {
    let nextExecuteTime =  this.characterState.lastQuests.get(this.constructor.name)?.nextExecuteTime
    if(nextExecuteTime) {
      myLog(`nextExecuteTime: ${new Date(nextExecuteTime).toLocaleString()}`)
      myLog(`getInterval: ${this.getInterval()}`)
      let isTimeTorun = new Date().getTime() > nextExecuteTime;
      myLog("是否可以执行: "+isTimeTorun)
      return isTimeTorun;
    }else {
      return true
    }
  }

   execute(): ExecuteResult {
    myLog(`Executing Quest ${this.constructor.name}`);
    let actionResult: ExecuteResult
    for (const step of this.steps) {
      myLog(`Executing step: ${step.constructor.name}`);
      executeWithRetry(step, this.characterState, this.functionConfig)
    }
    this.nextExecuteTime = new Date().getTime() + this.getInterval() * 1000
    this.characterState.lastQuests.set(this.constructor.name, this)
    return new SuccessResult(`action: ${this.constructor.name} success`);
  }
}

function executeWithRetry(step:Step, characterState: CharacterState, functionConfig: FunctionConfig):ExecuteResult {
  const startTime = new Date().getTime();
  while(true){
    try {
      return  step.execute(characterState, functionConfig)
    }catch (e){
      if (!(e instanceof NeedRepeatFailure)) {
        myLog(`Executing step: ${step.constructor.name} error.  ${e}`)
        throw e;
      }
      if (new Date().getTime() - startTime > repeatSeconds() * 1000) {
        return  new SuccessResult(`repeat execute step: ${step.constructor.name} time out.`)
      }
    }
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
  public nextExecuteTime: number = 0;
  protected steps = [new ToCity(),new ToCoinHarvester(), new ClickCoinPoll(this)]
  protected getInterval(): number {
    return intervalConfig.coin
  }
}

interface EnemyObject {
  name: EnemyName;
  times: number;
}

export class GetInBusQuest extends Quest {

  public expectObject(): {name: EnemyName, times: number}[] {
    let enemyNames:{name: EnemyName, times: number}[]  = [];
    if(this.functionConfig.getInBus.chuizi.enabled && this.functionConfig.getInBus.chuizi.times >= 0){
      enemyNames.push({name: EnemyName.Chuizi, times: this.functionConfig.getInBus.chuizi.times})
    }
    if(this.functionConfig.getInBus.heijun.enabled && this.functionConfig.getInBus.heijun.times >= 0){
      enemyNames.push({name: EnemyName.Heijun, times: this.functionConfig.getInBus.heijun.times})
    }
    if(this.functionConfig.getInBus.nanmin.enabled && this.functionConfig.getInBus.nanmin.times >= 0){
      enemyNames.push({name: EnemyName.Nanmin, times: this.functionConfig.getInBus.nanmin.times})
    }
    if(this.functionConfig.getInBus.juxing.enabled && this.functionConfig.getInBus.juxing.times >= 0){
      enemyNames.push({name: EnemyName.Juxing, times: this.functionConfig.getInBus.juxing.times})
    }
    return enemyNames
  }
  public configMatched(): boolean {
    return this.expectObject().length > 0;
  }

  weight = 5;
  protected steps = [
    new ToWorld(),
    new ToRallyWindow(),
    new GetInBus(this),
    new SelectCommanderSolider(),
    new ClickConfirmBattleBtn(),
    new CheckGetInBusSuccess(this),
  ]

  /**
   * times字段暂时好像没啥用 //todo
   */
  actualObject: {name: EnemyName, times: number} |null = null

  //重写postExecute方法
  postExecute(): ExecuteResult {
    if(this.actualObject == null) {
      return new SuccessResult("postExecute GetInBusQuest actualObject is null");
    }
    switch (this.actualObject.name) {
      case EnemyName.Chuizi:
        this.functionConfig.getInBus.chuizi.times -= 1;
        break;
      case EnemyName.Heijun:
        this.functionConfig.getInBus.heijun.times -= 1;
        break;
      case EnemyName.Nanmin:
        this.functionConfig.getInBus.nanmin.times -= 1;
      case EnemyName.Juxing:
        this.functionConfig.getInBus.juxing.times -= 1;
    }
    return new SuccessResult("postExecute GetInBusQuest");
  }
}
