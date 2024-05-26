import {CharacterState, FunctionConfig, HuntType} from './types';
import {loadConfig} from './configLoader';
import {createRuleFunction, generateQuest} from './ruleEngine';
import {findMultiColor, screenShot} from "./autoHandler";

// 加载配置文件
const config = loadConfig('src/config.json');

// 根据配置文件创建规则函数
const rules = config.rules.map(createRuleFunction);

// 示例角色状态和功能配置

function isWorldWindow(): boolean {
    //todo
    let result = findMultiColor(screenShot(), 'mainCityColor')
    if(result == null || result[0] == null){
        return false
    }else {
        return true;
    }
}

console.log("开始执行")
console.log(isWorldWindow)


// 生成动作指令
const action = generateQuest(rules);
console.log(action); // 输出：打1级普通怪
