import {findMultiColor, captureScreen, fromBase64, findImage, myLog, matchTemplate, myClick} from "./autoHandler";

import {GetInBus, ToCoinHarvester, ToWorld} from "./steps";

import {characterState, functionConfig} from "./config/config";

import {orcRallyEnemyName, orcTeamNum} from './ocr'
import {run} from "./ruleEngine";
// 加载配置文件

captureScreen()
sleep(2000)

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
    let quests = run()
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
