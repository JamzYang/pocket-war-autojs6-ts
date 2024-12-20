import {captureScreen, myClick, myLog} from "./helper/autoHandler";
import {toWorld, ToWorld} from "./core/step"

import {characterState} from "./config/config";

import {orcStamina, orcTeamNum} from './ocr'
import {run} from "./core/ruleEngine";
import {loadFeatureConfig} from "./core/configLoader";
import {loadRuleConfig} from "./core/condition";
import {hasDownwardTriangle} from "./helper/finder";
import {SoloHuntQuest} from "./hunt";
import any = jasmine.any;
import anything = jasmine.anything;
// 加载配置文件
let featureConfig = loadFeatureConfig()
let ruleConfig = loadRuleConfig()

captureScreen()
sleep(2000)


let downwardTriangle = hasDownwardTriangle();
//收起小地图
if (downwardTriangle) {
  myClick(downwardTriangle.x, downwardTriangle.y)
}
//========================== main ========================

while (true) {
  mainRun()
}


function mainRun() {
  try {
    toWorld()
    getIdleTeamNum()
    // characterState.stamina = orcStamina()
    orcStamina() //todo 只读取体力,但不赋值
    let quests = run(ruleConfig, characterState, featureConfig)
    if (quests.length == 0) {
      sleep(2000)
      return
    }
    let quest = quests[0]
    quest.execute()
    quest.postExecute()
  } catch (e) {
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
