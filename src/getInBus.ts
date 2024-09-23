import {Step,ToWorld, ToCity} from "./core/step";
import {ClickConfirmBattleBtn} from "./clickConfirmBattleBtn";

import {Quest} from "./core/quest";
import {EnemyName} from "./enum";
import {SelectCommanderSolider} from "./selectFormation";
import {ExecuteResult, SuccessResult, NeedRepeatFailure, Failure, FailureResult} from "./core/executeResult";

import {
  myLog, myClick, clickPoint, mySleep, captureScreen, captureScreenGray,
  matchTemplate, mySwipe, fromBase64, findMultiColor, findImage
}
  from "./helper/autoHandler";
import {orcRallyEnemyName, orcTeamNum} from "./ocr"
import {iconConfig} from "./config/iconConfig"
import {pointConfig} from "./config/pointConfig"
import {colorConfig} from "./config/colorConfig"
import {repeatSeconds} from "./config/env.conf";
import {intervalConfig} from "./config/intervalConfig";

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

  weight = 0;
  protected steps = [
    new ToWorld(this),
    new ToRallyWindow(this),
    new GetInBus(this),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
    new CheckGetInBusSuccess(this),
  ]

  /**
   * times字段暂时好像没啥用 //todo
   */
  actualObject: {name: EnemyName, times: number} |null = null

  //重写postExecute方法
  postExecute(questResult: ExecuteResult){
    if(this.actualObject == null) {
      myLog("postExecute GetInBusQuest actualObject is null")
      return;
    }

    if(! (questResult  instanceof SuccessResult)) {
      return;
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
        break;
      case EnemyName.Juxing:
        this.functionConfig.getInBus.juxing.times -= 1;
        break;
    }
  }
}

//跟车页 卡片之间垂直间隔610px,
export class GetInBus extends Step {
  execute(): ExecuteResult {
    //怪物名字 [496,309,684,352] 中心点： 349 272  相比加号中心 x偏移 147， y偏移 37  名字框 高 43 宽 188
    //这个方法有个问题。多点找色只能找到最上面一个
    // let result = findMultiColor(img, colorConfig.rallyJoinInIcon)

    //上车图标区域[318,242,383,309]  怪物文字栏 482,305  682, 345  x偏移164 y偏移 63 宽 131 高 113
    //最后一列上车图标垂直区域 [311,236,389,943]
    myLog("开始搜索车位....")
    let img = captureScreen()
    myLog("截图结束，开始找车位")
    const matchingResult = matchTemplate(img, fromBase64(iconConfig.getInBusIcon.base64), {
      region: [311, 236, 78, 710], // 或者 org.opencv.core.Rect 或 android.graphics.Rect 对象
    });
    // img.recycle(); todo
    myLog("匹配结束：" + JSON.stringify(matchingResult.points))
    if (matchingResult.points.length > 0) {
      //matchingResult.points 去重
      let points = Array.from(new Set(matchingResult.points));
      myLog("去重后：" + JSON.stringify(points))
      for (const point of points) {
        myLog("开始识别怪物名字")
        let enemyName = orcRallyEnemyName(
            [
              point.x + 164,
              point.y + 63,
              point.x + 164+ 131,
              point.y + 63 + 113
            ]
        )
        myLog('怪物名字: ' + enemyName)
        let expectObject = (this.quest as GetInBusQuest).expectObject();
        myLog("集结目标: " + JSON.stringify(expectObject))
        if (enemyName && expectObject.find(item => item.name == enemyName)) {
          myClick(point.x + iconConfig.getInBusIcon.offSet.x, point.y + iconConfig.getInBusIcon.offSet.y, 300, "click get in bus icon");
          (this.quest as GetInBusQuest).actualObject = {name: enemyName, times: 1}
          return new SuccessResult('GetInBus success. enemyName=' + enemyName)
        }
      }
    }
    myLog("没有找到空坐位....")
    // mySleep(2000)
    // throw new NeedRepeatFailure('没有找到空坐位',  Number(repeatSeconds().toString() || '50'))
    return new FailureResult('GetInBus fail.')
  }
}

export class CheckGetInBusSuccess extends Step {
  execute(): ExecuteResult {
    let result =  findImage(
        captureScreen(), fromBase64(iconConfig.noticeBar.base64),
        {threshold: 0.7, region: [0, 280, 150, 100]}
    )
    if(result) {
      return new FailureResult("确认出征失败")
    }

    return new SuccessResult('CheckGetInBusSuccess')
  }
}

export class ToRallyWindow extends Step {
  execute(): ExecuteResult {
    myClick(pointConfig.unionIcon.x, pointConfig.unionIcon.y, 400, "ClickUnionIcon")
    myClick(pointConfig.warIcon.x, pointConfig.warIcon.y, 400, "ClickWarIcon")
    let result = findMultiColor(captureScreen(), colorConfig.rallyNoBusWindow)
    if (result != null) {
      myClick(pointConfig.rallyNoBusWindowCloseBtn.x, pointConfig.rallyNoBusWindowCloseBtn.y, 200, "click rallyNoBusWindowCloseBtn")
      new ToWorld(this.quest).execute()
      throw new NeedRepeatFailure('no bus found', Number(repeatSeconds().toString() || '50'))
    }
    return new SuccessResult('ToRallyWindow')
  }
}