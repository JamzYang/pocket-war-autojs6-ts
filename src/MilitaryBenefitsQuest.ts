import {Quest} from "./core/quest";
import {Step, ToCity} from "./core/step";
import {intervalConfig} from "./config/intervalConfig";
import {ExecuteResult, SuccessResult, FailureResult, Failure, TodayTaskNotRequiredFailure} from "./core/executeResult";
import {captureScreen, clickPoint, findImage, fromBase64, myLog} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";

export class MilitaryBenefitsQuest extends Quest{
  public name: string = "沙盘演习";
  public nextExecuteTime: number = 0;
  public weight = 10;
  protected steps = [
    new ToCity(this),
  ]
  protected getInterval(): number {
    return intervalConfig.freeDiamond
  }
}