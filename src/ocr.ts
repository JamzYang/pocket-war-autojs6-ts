import * as autoHandler from "./helper/autoHandler";
import {myClick, myErrorLog, myLog, ocrTextFromImgMlkit, ocrTextLite} from "./helper/autoHandler";
import {EnemyName} from "./enum";

//行军队列数量bar 区域 [1,275,243,541]
export function orcTeamNum(): { idle: number, total: number } {
  let text = autoHandler.ocrText([1, 275, 243, 331])
  myLog(`识别队列占用: ${text}`)
  //查询包含'行军'的元素索引
  let flag = text.filter(text => text.includes('行军'))
  let num = text.filter(text => text.includes('/'))
  if (flag.length == 1 && num.length == 1) {
    let slashIndex = num[0].indexOf('/');
    let total = parseInt(num[0].charAt(slashIndex +1))
    let occupied = parseInt(num[0].charAt(slashIndex -1))
    let idle = total - occupied
    return {idle: idle, total: total}
  }
  //查不到默认空闲1队
  return {idle:1, total:1};
}


export function orcStamina(): number {
  // let text = autoHandler.ocrText([181,14,241,41])
  let text = autoHandler.ocrTextLite([173,5,245,49])
  myLog(`体力读取: ${text}`)
  let result = parseInt(text[0])
  if(result && !Number.isNaN(result)){
    return result
  }
  if(text[0].length >= 2){
    let firstSymbal = text[0].charAt(0)
    let array = ["1","2","3","4"]
    if(array.some(item => item == firstSymbal)){
      myErrorLog("体力识别失败,返回50")
      return 50
    }
  }
  myErrorLog("体力识别失败,返回0")
  return 0
}


export function orcRallyEnemyName(region: number[]): EnemyName | null {
  let ocrResults = autoHandler.ocrText(region)
  myLog("识别结果=>" + JSON.stringify(ocrResults))
  //将text打印成json
  if (ocrResults.map(o => o).some(item => item.includes('战锤'))) {
    return EnemyName.Chuizi
  }

  if (ocrResults.map(o => o).some(item => item.includes('星'))) {
    return EnemyName.Juxing
  }

  if (ocrResults.map(o => o).some(item => item.includes('军团') || item.includes('据点'))) {
    return EnemyName.Heijun
  }

  if (ocrResults.map(o => o).some(item => item.includes('难民'))) {
    return EnemyName.Nanmin
  }

  if (ocrResults.map(o => o).some(item => item.includes('砰砰'))) {
    return EnemyName.Pengpeng
  }

  if (ocrResults.map(o => o).some(item => item.includes('精卫'))) {
    return EnemyName.Jingwei
  }

  if (ocrResults.map(o => o).some(item => item.includes('守卫'))) {
    return EnemyName.Shouwei
  }
  return null;
}




