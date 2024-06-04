import {findMultiColor, captureScreen, fromBase64, findImage, myLog, matchTemplate, myClick} from "./autoHandler";
import {colorConfig} from "./config/colorConfig";
import {iconConfig} from "./config/iconConfig";
import {GetInBus, ToCoinHarvester, ToWorld} from "./steps";
import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest, GetInBusQuest,
  SoloHuntQuest,
  SuccessResult
} from "./types";
import {characterState, functionConfig} from "./config/config";
import {hasBackBtn} from "./finder";
import * as autoHandler from "./autoHandler"
import {orcRallyEnemyName, orcTeamNum} from './ocr'
import {run} from "./ruleEngine";
// 加载配置文件
// const config = loadConfig('src/config.json');
//
// // 根据配置文件创建规则函数
// const rules = config.rules.map(createRuleFunction);
let customizedConfig = functionConfig;
let storedConfig = storages.create("FunctionConfig").get("config");
console.log("main从本地存储读取配置："+storedConfig)
if (storedConfig) {
  customizedConfig = JSON.parse(storedConfig);
}

toastLog("开始执行")

// threads.start(() => {
//     if(!requestScreenCapture()){
//         toast("请求截图失败");
//         exit();
//     }
// })
captureScreen()
sleep(2000)
// toast("是否是世界主界面:" +isWorldWindow())
// myLog("是否是世界主界面:" +isWorldWindow())
// toast("检测关闭按钮:" + hasCloseBtn())
// myLog("检测关闭按钮:" + hasCloseBtn())
// let toWorld = new ToWorld();
// toWorld.execute(characterState, functionConfig)

// let toCoinHarvester = new ToCoinHarvester();
// toCoinHarvester.execute(characterState, functionConfig)

// let coinQuest = new CollectCoinsQuest()
// coinQuest.execute(characterState, functionConfig)

// let gatherFood = new GatherFoodQuest();
// gatherFood.execute(characterState, functionConfig);

//[1,485,243,541]
// let text = orcTeamNum()
//
// toast("ocr text ==>" + text)
// myLog("ocr text ==>" + text?.idle + "===" + text?.total)
// 生成动作指令
// const action = generateQuest(rules);
// myLog(action); // 输出：打1级普通怪
// let getInBus = new GetInBus();
// getInBus.execute(characterState, functionConfig)
// let matchResult = autoHandler.matchTemplate(captureScreen(), fromBase64(iconConfig.backBtn.base64))
//
// if(matchResult.matches.length >= 1){
//     toast("匹配到返回按钮")
//     myLog("匹配到返回按钮")
// }

// let img = captureScreen()
// const matchingResult = matchTemplate(img, fromBase64(iconConfig.getInBusIcon.base64), {
//   region: [311,236, 78, 710], // 或者 org.opencv.core.Rect 或 android.graphics.Rect 对象
// });
// //将matchingResult转成json 并打印
// myLog(JSON.stringify(matchingResult))
//
// if(matchingResult.points.length > 0) {
//   matchingResult.points.forEach(point => {
//     let enemyName = orcRallyEnemyName(img,[point.x + 164, point.y +63, 131, 113])
//     myLog('怪物名字: ' + enemyName)
//     //todo 如果和quest中的目标一致就 上车
//   });
// }

// let getInBus = new GetInBus();
// let getInBusQuest = new GetInBusQuest();
// getInBusQuest.execute(characterState, customizedConfig);
// getInBusQuest.postExecute(characterState, customizedConfig)
while (true) {
  try {
    new ToWorld().execute(characterState, customizedConfig)
    let idle = orcTeamNum()?.idle
    if(idle && idle > 0){
      myLog("有空闲队伍")
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
    quest.execute(characterState, customizedConfig)
    quest.postExecute(characterState, customizedConfig)
  }catch (e){
    console.error('An error occurred:', e);
  }
}

// new GetInBus(new GetInBusQuest()).execute(characterState, customizedConfig)
// myLog("开始识别")
// orcRallyEnemyName([0,0,720,1280])