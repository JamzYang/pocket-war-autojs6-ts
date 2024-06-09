import {
  findMultiColor,
  captureScreen,
  fromBase64,
  findImage,
  myLog,
  matchTemplate,
  myClick,
  captureScreenGray
} from "./autoHandler";

import {GetInBus, ToCoinHarvester, ToWorld} from "./steps";

import {characterState, functionConfig} from "./config/config";

import {orcRallyEnemyName, orcTeamNum} from './ocr'
import {run} from "./ruleEngine";
import {loadFeatureConfig} from "./configLoader";
import {loadRuleConfig} from "./condition";
import * as autoHandler from "./autoHandler";
import {OceanTreasureQuest} from "./oceanTreasure";
import {iconConfig} from "./config/iconConfig";
import {hasDownwardTriangle} from "./finder";
// 加载配置文件
let featureConfig = loadFeatureConfig()
let ruleConfig = loadRuleConfig()

captureScreen()
sleep(2000)

let downwardTriangle = hasDownwardTriangle();
//收起小地图
if(downwardTriangle){
  myClick(downwardTriangle.x,downwardTriangle.y)
}
myLog("小三角坐标: "+downwardTriangle)

//========================== main ========================
while (true) {
  mainRun()
}


 function mainRun() {
  try {
    new ToWorld().execute(characterState)
    let idle = orcTeamNum()?.idle
    if(idle && idle > 0){
      myLog("空闲队伍："+idle)
      characterState.idleTeams = idle
    }else {
      characterState.idleTeams = 0
      myLog("没有空闲队伍")
    }
    let quests = run(ruleConfig, characterState, featureConfig)
    if(quests.length == 0){
      myLog("没有任务")
      sleep(2000)
      return
    }
    let quest = quests[0]
    quest.execute()
    quest.postExecute()
  }catch (e){
    console.error('An error occurred:', e);
  }
}