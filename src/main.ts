import {loadConfig} from './configLoader';
import {createRuleFunction, generateQuest} from './ruleEngine';
import {findMultiColor, captureScreen, fromBase64, findImage} from "./autoHandler";
import {colorConfig} from "./colorConfig";
import {iconConfig} from "./iconConfig";

// 加载配置文件
// const config = loadConfig('src/config.json');
//
// // 根据配置文件创建规则函数
// const rules = config.rules.map(createRuleFunction);


function isWorldWindow(): boolean {
    let result = findMultiColor(captureScreen(), colorConfig.mainWindow.mainCityColor)
    return result != null
}
sleep(2000)
toast("开始执行")
toast("是否是世界主界面:" +isWorldWindow())
console.log("是否是世界主界面:" +isWorldWindow())
toast("检测关闭按钮:" + hasCloseBtn())
console.log("检测关闭按钮:" + hasCloseBtn())
toast("检测返回按钮:" + hasBackBtn())
console.log("检测返回按钮:" + hasBackBtn())
function hasCloseBtn(): OpenCV.Point | null {
    let icon = fromBase64(iconConfig.closeBtn)
    return findImage(captureScreen(), icon)
}

function hasBackBtn(): OpenCV.Point | null {
    let icon = fromBase64(iconConfig.backBtn)
    return findImage(captureScreen(), icon)
}

// 生成动作指令
// const action = generateQuest(rules);
// console.log(action); // 输出：打1级普通怪
