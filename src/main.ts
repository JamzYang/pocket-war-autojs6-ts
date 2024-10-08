import {captureScreen, clickPoint, fromBase64, matchTemplate, myLog, mySleep} from "./helper/autoHandler";
import {toWorld} from "./core/step"

import {characterState} from "./config/config";

import {orcStamina, orcTeamNum} from './ocr'
import {run} from "./core/ruleEngine";
import {loadFeatureConfig} from "./core/configLoader";
import {loadRuleConfig} from "./core/condition";
import {hasDownwardTriangle} from "./helper/finder";

// 加载配置文件
let featureConfig = loadFeatureConfig()
myLog("配置："+JSON.stringify(featureConfig))

toWorld()
let downwardTriangle = hasDownwardTriangle();
//收起小地图
if (downwardTriangle) {
  clickPoint(downwardTriangle)
}
//========================== main ========================

while (true) {
  mainRun()
}


function mainRun() {
  try {
    let ruleConfig = loadRuleConfig(featureConfig)
    toWorld()
    getIdleTeamNum()
    // characterState.stamina = orcStamina()
    orcStamina() //todo 只读取体力,但不赋值

    let quests = run(characterState, featureConfig)
    if (quests.length == 0) {
      //无任务休眠10s
      sleep(10000)
      return
    }
    let quest = quests[0]
    quest.preExecute()
    let questResult=  quest.execute()
    quest.postExecute(questResult)
  } catch (e: any) {
    console.error('An error occurred:', e);
  }
}

function getIdleTeamNum() {
  let idle = orcTeamNum().idle
  if (idle && idle > 0) {
    myLog("空闲队伍：" + idle)
    characterState.idleTeams = idle
  } else {
    characterState.idleTeams = 0
    // myLog("没有空闲队伍")
  }
}
