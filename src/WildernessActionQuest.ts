import {Quest} from "./core/quest";
import {Step, ToCity} from "./core/step";
import {intervalConfig} from "./config/intervalConfig";
import {ExecuteResult, SuccessResult, FailureResult, Failure, TodayTaskNotRequiredFailure} from "./core/executeResult";
import {
  captureScreen,
  clickPoint,
  findImage, findMultiColor,
  fromBase64,
  myClick,
  myLog,
  mySleep,
  mySwipe,
  ocrDetectScreen
} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import {colorConfig} from "./config/colorConfig";

let pickBtn = {x:68, y: 253}

export class WildernessActionQuest extends Quest{
  public name: string = "荒野行动";
  public nextExecuteTime: number = 0;
  public weight = 1;
  protected steps = [
    new ToCity(this),
      new ToWildernessAction(this),
      new Pick(this),
      new Sweep(this),
      new ModuleResearch(this),
  ]
  protected getInterval(): number {
    return intervalConfig.twoHour
  }
}


class ToWildernessAction extends Step{
  execute() {
    myClick(pointConfig.intelligenceIcon.x, pointConfig.intelligenceIcon.y)
    let findTimes = 0;
    let result  = this.findSandTable()
    while(findTimes < 3 && result == null) {
      mySwipe(360,900,360,500,2000)
      result = this.findSandTable()
      findTimes ++
    }
    if(result == null) {
      myLog(`can not find ${this.quest.name} icon`)
      throw new Failure("没有找到 荒野行动")
    }
    myClick(result.x, result.y, 1000,)
  }

  private findSandTable(){
    let ocrResults = ocrDetectScreen();
    let labels = ocrResults.map(result => result.label);
    myLog(JSON.stringify(labels));
    let find = ocrResults.find(
        item => item.label.includes("荒野行动")
    );
    //匹配到文字后,有可能文字比较靠下, 前往按钮没显示出来,所以要再往上划一下
    if(find && find.bounds.centerY() < (1280 - 200)) {
      //卡片标题和下面的前往btn 垂直坐标差160
      return {x: find.bounds.centerX(), y: find.bounds.centerY() + 160}
    }else {
      return null
    }
  }
}

class Pick extends Step{
  execute() {
    myClick(pickBtn.x,pickBtn.y)
  }
}

class ModuleResearch extends Step{
  execute() {
    //todo
  }
}

class Sweep extends Step{
  execute() {
    this.handleSweepBtn()
    this.handleSweepBtn()
  }

  private handleSweepBtn(){
    let result = findMultiColor(captureScreen(),colorConfig.wildernessSweepBtn);
    if(result) {
      myClick(result.x, result.y)
      sleep(1000)
    }
  }
}