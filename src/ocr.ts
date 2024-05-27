import * as autoHandler from "./autoHandler";

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