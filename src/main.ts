import {findMultiColor, captureScreen, fromBase64, findImage, myLog, matchTemplate, myClick} from "./autoHandler";

import {GetInBus, ToCoinHarvester, ToWorld} from "./steps";

import {characterState, functionConfig} from "./config/config";

import {orcRallyEnemyName, orcTeamNum} from './ocr'
import {run} from "./ruleEngine";
import {loadFeatureConfig} from "./configLoader";
import {loadRuleConfig} from "./condition";
import * as autoHandler from "./autoHandler";
import {OceanTreasureQuest} from "./oceanTreasure";
import {iconConfig} from "./config/iconConfig";
// 加载配置文件


let featureConfig = loadFeatureConfig()
let ruleConfig = loadRuleConfig()

captureScreen()
sleep(2000)

// let text = autoHandler.ocrText([100,1036,580,27])
//     [88,1031,660,1068]
// let text = autoHandler.ocrText([88,1031,580,37])
// let text = autoHandler.ocrText([76,1004,589,94])
//
// myLog("倒计时识别结果=>" + JSON.stringify(text))

// let result = findImage(captureScreen(), fromBase64(iconConfig.oceanTreasure.base64),{
//   threshold: 0.8,
//   region: [0, 70, 720, 120]
// })
// myLog("识别结果=>" + JSON.stringify(result))
new OceanTreasureQuest(characterState, featureConfig).execute()

while (true) {
  try {
    new ToWorld().execute(characterState)
    let idle = orcTeamNum()?.idle
    if(idle && idle > 0){
      myLog("空闲队伍："+idle)
      characterState.idleTeams = idle
    }else {
      myLog("没有空闲队伍")
    }
    let quests = run(ruleConfig, characterState, featureConfig)
    if(quests.length == 0){
      myLog("没有任务")
      sleep(2000)
      continue
    }
    let quest = quests[0]
    quest.execute()
    quest.postExecute()
  }catch (e){
    console.error('An error occurred:', e);
  }
}
