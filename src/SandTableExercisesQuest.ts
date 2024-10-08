import {Quest} from "./core/quest";
import {Step, ToWorld} from "./core/step";
import {intervalConfig} from "./config/intervalConfig";
import {Failure} from "./core/executeResult";
import {myClick, myLog, mySleep, mySwipe, ocrDetect, ocrDetectScreen} from "./helper/autoHandler";
import {pointConfig} from "./config/pointConfig";
import {ClickConfirmBattleBtn} from "./clickConfirmBattleBtn";

let challengeBtn = {x: 360, y:1200}
let skipBtn = {x: 37, y:204}
let challengeAgainBtn = {x: 247, y:1130}

export class SandTableExercisesQuest extends Quest{
  public name: string = "沙盘演习";
  public weight = 10;
  protected steps = [
    new ToWorld(this),
    new ToSandTable(this),
    new Challenge(this),
    new ClickConfirmBattleBtn(this),
    new Skip(this),
    new ChallengeAgain(this),
  ]
  protected getInterval(): number {
    return intervalConfig.freeDiamond
  }
}

class ToSandTable extends Step{
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
      throw new Failure("没有找到 沙盘演习")
    }
    ////`前往button`
    myClick(result.x, result.y, 1000,)
  }

  private findSandTable(){
    let ocrResults = ocrDetectScreen();
    let labels = ocrResults.map(result => result.label);
    myLog(JSON.stringify(labels));
    let find = ocrResults.find(
        item => item.label.includes("沙盘演习")
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

class Challenge extends Step{
  execute() {
    myClick(challengeBtn.x,challengeBtn.y)
  }
}



class ChallengeAgain extends Step{
  execute() {
    //再次挑战 按钮是个浮层, ocr识别困难. 容易把背景中的文字也识别出来
    let againBtn = findChallengeAgainBtn();
    if(againBtn){
      myClick(againBtn.bounds.centerX(), againBtn.bounds.centerY())
      this.quest.addStep(new Skip(this.quest))
    }else {
      throw new Failure("没有找到 再次挑战 按钮")
    }
    // myClick(challengeAgainBtn.x,challengeAgainBtn.y)
  }
}

class Skip extends Step{
  execute() {
    mySleep(2000)
    myClick(skipBtn.x,skipBtn.y)
    mySleep(2000)
    let againBtn = findChallengeAgainBtn()
    if(againBtn){
      this.quest.addStep(new ChallengeAgain(this.quest))
    }
  }
}

function findChallengeAgainBtn() {
  let ocrResults = ocrDetect([11, 999, 709, 1250])
  return ocrResults.find(
      item => item.label.includes("再次挑战")
  );
}