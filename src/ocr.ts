import * as autoHandler from "./autoHandler";
import {EnemyName, NeedRepeatFailure, TextParseError} from "./types";
import {myLog, ocrTextFromImgMlkit} from "./autoHandler";

//行军队列数量bar 区域 [1,275,243,541]
export function orcTeamNum(): { idle: number, total: number } | null {
  let text = autoHandler.ocrText([1, 275, 243, 56])
  //查询包含'行军'的元素索引
  let flag = text.filter(text => text.includes('行军'))
  let num = text.filter(text => text.includes('/'))
  if (flag.length == 1 && num.length == 1) {
    let total = parseInt(num[0].split('/')[1])
    let idle = total - parseInt(num[0].split('/')[0])
    return {idle: idle, total: total}
  }
  return null;
}

export function orcRallyEnemyName(region: OmniRegion): EnemyName | null {
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




