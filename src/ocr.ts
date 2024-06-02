import * as autoHandler from "./autoHandler";
import {EnemyName} from "./types";

//行军队列数量bar 区域 [1,485,243,541]
export function orcTeamNum(): {idle: number, total: number} | null {
  let text = autoHandler.ocrText([1,485,243,56])
  //查询包含'行军'的元素索引
  let flag = text.filter(text => text.includes('行军'))
  let num = text.filter(text => text.includes('/'))
  if(flag.length ==1 && num.length ==1){
    return {idle: parseInt(num[0].split('/')[0]), total: parseInt(num[0].split('/')[1])}
  }
  return null;
}

export function orcRallyEnemyName(img: ImageWrapper, region: OmniRegion): EnemyName | null {
  let ocrResults = autoHandler.ocrTextFromImg(img, region)

  //将text打印成json
  if(ocrResults.map(o => o.label).some(item => item.includes('战锤'))) {
    return EnemyName.Chuizi
  }

  if(ocrResults.map(o => o.label).some(item => item.includes('惧星'))){
    return EnemyName.Juxing
  }

  if(ocrResults.map(o => o.label).some(item => item.includes('黑暗军团'))){
    return EnemyName.Heijun
  }

  if(ocrResults.map(o => o.label).some(item => item.includes('难民'))){
    return EnemyName.Nanmin
  }

  if(ocrResults.map(o => o.label).some(item => item.includes('砰砰'))){
    return EnemyName.Pengpeng
  }

  if(ocrResults.map(o => o.label).some(item => item.includes('精卫'))){
    return EnemyName.Jingwei
  }

  if(ocrResults.map(o => o.label).some(item => item.includes('守卫'))){
    return EnemyName.Shouwei
  }
  return null;
}