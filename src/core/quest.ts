import {myLog} from "../helper/autoHandler";
import {repeatSeconds} from "../config/env.conf";
import {Step} from "./step";
import {CharacterState} from "./characterState";
import {FunctionConfig} from "./functionConfig";
import {ExecuteResult, NeedRepeatFailure, SuccessResult} from "./executeResult";

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
    myLog(`Quest: ${this.constructor.name} success`)
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