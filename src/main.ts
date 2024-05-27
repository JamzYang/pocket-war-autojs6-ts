import {loadConfig} from './configLoader';
import {createRuleFunction, generateQuest} from './ruleEngine';
import {findMultiColor, captureScreen, fromBase64, findImage, myLog} from "./autoHandler";
import {colorConfig} from "./config/colorConfig";
import {iconConfig} from "./config/iconConfig";
import {ToCoinHarvester, ToWorld} from "./steps";
import {CharacterState, CollectCoinsQuest, FunctionConfig, GatherFoodQuest} from "./types";
import {characterState, functionConfig} from "./config/config";
import {hasBackBtn} from "./finder";
import * as autoHandler from "./autoHandler"
// 加载配置文件
// const config = loadConfig('src/config.json');
//
// // 根据配置文件创建规则函数
// const rules = config.rules.map(createRuleFunction);

if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}
sleep(2000)
toast("开始执行")
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


function isWorldWindow(): boolean {
    let result = findMultiColor(captureScreen(), colorConfig.mainWindow.mainCityColor)
    return result != null
}

//[1,485,243,541]
let text = autoHandler.ocrText([1,485,243,56])
for (const textKey in text) {
    myLog(textKey + " ==>" + text[textKey])
}

toast("ocr text ==>" + text)
myLog("ocr text ==>" + text)
// 生成动作指令
// const action = generateQuest(rules);
// myLog(action); // 输出：打1级普通怪
