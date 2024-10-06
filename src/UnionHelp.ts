import {Quest} from "./core/quest";
import {intervalConfig} from "./config/intervalConfig";
import {Step, ToCity} from "./core/step";
import {clickPoint, myClick, myLog, mySleep, myToast, ocrDetect, ocrDetectScreen} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import * as autoHandler from "./helper/autoHandler";

let confirmForHelpBtn = {x:368, y: 912}
let closeForHelpWindow = {x:651, y: 299}

export class UnionHelpQuest extends Quest {
  public weight = 0;
  public nextExecuteTime: number = 10;

  protected getInterval(): number {
    return intervalConfig.unionHelp
  }
  protected steps = [
    new ToCity(this),
    new ToUnion(this),
    new ToUnionHelp(this),
    new CheckPick(this),
    new ForHelp(this),
  ]
}

class ToUnion extends Step {
  execute() {
    clickPoint(pointConfig.unionIcon)
  }
}

class ToUnionHelp extends Step {
  execute() {
    clickPoint(pointConfig.unionHelp)
  }
}

class CheckPick extends Step {
  execute() {
    // let ocrResults = ocrDetect([454,1007,685,1188]);
    let ocrResults = ocrDetect([43,887,680,1192]);
    //先点帮助盟友
    let helpAllBtn = ocrResults.find(
        item => item.label.includes("帮助全部") && item.label.length == 4
    );
    if(helpAllBtn){
      myClick(helpAllBtn.bounds.centerX(),helpAllBtn.bounds.centerY())
    }

    //今日帮助是否已完成
    let helped10Times = ocrResults.find(
        item => item.label.includes("10/10")
    );
    let countDownTime = ocrResults.find(
        item => (item.label.includes(":") && (item.label.match(/:/g) || []).length === 2)
    )
    if(helped10Times && countDownTime){
      this.quest.getFunctionConfig.unionHelp = false
      myToast("今日联盟帮助已完成")
    }

    let pickBtn = ocrResults.find(
        item => item.label.includes("领取") && item.label.length ==4
    );
    if(pickBtn){
      myClick(pickBtn.bounds.centerX(),pickBtn.bounds.centerY())
      clickPoint(pointConfig.targetCenter)
      //休眠, 防止动画遮挡
      mySleep(1500)
    }
  }
}

class ForHelp extends Step {
  execute() {
    let ocrResults = ocrDetect([454,1007,685,1188]);
    myLog(JSON.stringify(ocrResults))
    let forHelpBtn = ocrResults.find(
        item => item.label.includes("请") && item.label.includes("帮助") && item.label.length ==4
    );
    if(forHelpBtn){
      myClick(forHelpBtn.bounds.centerX(),forHelpBtn.bounds.centerY())
    }
    //识别矿石数量
    let ocrResults2 = ocrDetect([56,354,677,507]);
    myLog(JSON.stringify(ocrResults2))
    let smallestNumberResult = ocrResults2.reduce((min, current) => {
      const currentNumber = parseInt(current.label);
      if (!isNaN(currentNumber) && (min === null || currentNumber < parseInt(min.label))) {
        return current;
      }
      return min;
    }, null as { label: string; bounds: { centerX: () => number; centerY: () => number } } | null);

    if (smallestNumberResult) {
      myClick(smallestNumberResult.bounds.centerX(), smallestNumberResult.bounds.centerY());
      myClick(confirmForHelpBtn.x,confirmForHelpBtn.y);
    }
  }
}