import {myLog} from "../helper/autoHandler";
import {repeatSeconds} from "../config/env.conf";
import {Step} from "./step";
import {CharacterState} from "./characterState";
import {FunctionConfig} from "./functionConfig";
import {ExecuteResult, FailureResult, NeedRepeatFailure, NoHeroSelectedError, SuccessResult} from "./executeResult";
import {getFormattedTime} from "../helper/dateHelper";

export class Quest {
  protected characterState: CharacterState;
  protected functionConfig: FunctionConfig;
  protected steps: Step[] = [];
  public weight: number = 0;
  public nextExecuteTime: number = 0;
  public name: string = "";
  /**
   * 执行周期. 单位:秒
   * @protected
   */
  protected getInterval(): number {return 0};
  constructor(characterState: CharacterState, functionConfig: FunctionConfig) {
    this.characterState = characterState;
    this.functionConfig = functionConfig;
  }

  get getCharacterState() {
    return this.characterState;
  }

  get getFunctionConfig() {
    return this.functionConfig;
  }

  postExecute (questResult: ExecuteResult) {

  }

  configMatched(): boolean {
    let nextExecuteTime =  this.characterState.lastQuests.get(this.constructor.name)?.nextExecuteTime
    if(nextExecuteTime) {
      let isTimeToRun = new Date().getTime() > nextExecuteTime;
      myLog(`${this.name} 下次执行时间: ${getFormattedTime(nextExecuteTime)}`)
      return isTimeToRun;
    }else {
      return true
    }
  }

  execute(): ExecuteResult {
    try {
      myLog(`Executing Quest ${this.constructor.name}`);
      let actionResult: ExecuteResult
      for (const step of this.steps) {
        // myLog(`Executing step: ${step.constructor.name}`);
        executeWithRetry(step)
      }
      //只有 Interval > 0 才有必要给 nextExecuteTime赋值.
      if(this.getInterval() > 0) {
        this.nextExecuteTime = new Date().getTime() + this.getInterval() * 1000
      }
      this.characterState.lastQuests.set(this.constructor.name, this)
      myLog(`Quest: ${this.constructor.name} success`)
      return new SuccessResult(`action: ${this.constructor.name} success`);
    }catch (e: any) {
      myLog(`Quest: ${this.constructor.name} error.`)
      if(e.name === "NoHeroSelectedError" || e instanceof NoHeroSelectedError) {
        //打野英雄没回家时sleep 60秒
        this.nextExecuteTime = new Date().getTime() + 60 * 1000
        this.characterState.lastQuests.set(this.constructor.name, this)
        myLog(`no hero selected. wait ${60} seconds`)
      }
      return new FailureResult(`${this.constructor.name} fail. ${e.name}`);
    }
  }
   addStep(step: Step) {
    this.steps.push(step)
  }
}

function executeWithRetry(step:Step):ExecuteResult {
  const startTime = new Date().getTime();
  while(true){
    try {
      return step.execute()
    }catch (e: any){
      if (e instanceof NeedRepeatFailure) {
        if (new Date().getTime() - startTime > repeatSeconds() * 1000) {
          return new SuccessResult(`repeat execute step: ${step.constructor.name} time out.`)
        }
        // 继续循环
      } else {
        myLog(`executeWithRetry 捕获到错误: ${e.constructor.name}`);
        myLog(`step: ${step.constructor.name} error.  ${e}`)
        throw e;
      }
    }
  }
}



export class NullQuest extends Quest {

}

