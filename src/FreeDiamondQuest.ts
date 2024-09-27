import {Quest} from "./core/quest";
import {Step, ToCity} from "./core/step";
import {intervalConfig} from "./config/intervalConfig";
import {ExecuteResult, SuccessResult, FailureResult, Failure, TodayTaskNotRequiredFailure} from "./core/executeResult";
import {captureScreen, clickPoint, findImage, fromBase64, myLog} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import now = jest.now;
import {getFormattedTimeNow} from "./helper/dateHelper";


export class FreeDiamondQuest extends Quest {
  public name: string = "免费钻石";
  public nextExecuteTime: number = 0;
  public weight = 10;
  protected steps = [
    new ToCity(this),
    new ToWeeklyMemberTab(this),
    new CheckTimes(this),
    new TakeDiamond(this)
  ]
  protected getInterval(): number {
    return intervalConfig.freeDiamond
  }

  configMatched(): boolean {
    return  super.configMatched();
  }
}

 class ToWeeklyMemberTab extends Step {
   execute() {
    clickPoint(pointConfig.packageStoreBtn)
    clickPoint(pointConfig.weeklyMemberTab, 800)
    return new SuccessResult("ToWeeklyMemberTab")
  }
}

class TakeDiamond extends Step {
  execute() {
    clickPoint(pointConfig.takeDiamondBtn)
    return new SuccessResult("TakeDiamond")
  }
}

class CheckTimes extends Step {
  execute() {
    let screen = captureScreen()
    // images.saveImage(screen,`/sdcard/脚本/周卡界面${getFormattedTimeNow()}`,"png",100)
    // images.saveImage(screen, `/sdcard/脚本/${new Date().getTime()}.png`);
    let result = findImage(
        screen,
        fromBase64(iconConfig.takeDiamondGrayBtn.base64)
    );
    if (result) {
      throw new TodayTaskNotRequiredFailure("免费钻石已领取");
    }
    return new SuccessResult("CheckTimes")
  }
}
