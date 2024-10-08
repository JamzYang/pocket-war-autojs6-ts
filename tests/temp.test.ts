
import '@jest/globals';
// describe('temp', () => {
//   it('should work', () => {
//     expect(true).toBe(true)
//   })
// })


import { myLog } from '../src/helper/autoHandler';
import {SoloHuntQuest} from "../src/hunt";
import {HuntType} from "../src/enum";
import {FunctionConfig} from "../src/core/functionConfig";
import * as console from "console";

// Mocking the entire module
jest.mock('../src/helper/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
}));

test('myLog should be called with correct message', () => {
  const msg = 'test message';
  // Act
  let result = [{x:1,y:1},{x:2,y:2},{x:1,y:1},{x:1,y:1}]

  let points = result.filter((item, index, self) => {
    return self.findIndex(i => i.x === item.x && i.y === item.y) === index;
  });
  myLog(msg);

  //倒计时区域 [76,1004,665,1098] 转成region   [76,1004,589,94]
  let range = [76,1004,665,1098];
  let region = toOmnRegion(range)
  expect(region).toEqual([76,1004,589,94]);
  // Assert
  expect(myLog).toHaveBeenCalledWith(msg);

  let number = parseInt("G8");
  let name = SoloHuntQuest.name;
  myLog(`${SoloHuntQuest.name}`)

  let teamNumText =  ["(行军 3/5"]
  let flag = teamNumText.filter(text => text.includes('行军'))
  let num = teamNumText.filter(text => text.includes('/'))
  if (flag.length == 1 && num.length == 1) {
    let slashIndex = num[0].indexOf('/');
    let total = parseInt(num[0].charAt(slashIndex +1))
    let occupied = parseInt(num[0].charAt(slashIndex -1))
    let idle = total - occupied;
    let byTurn = HuntType.byTurn
    myLog(`${HuntType.byTurn.toString()}`)
  }


});

test('huntTypeElement',()=>{
  let huntTypeElement = HuntType['army' as keyof typeof HuntType];
  let parse: FunctionConfig = JSON.parse("{\"collectCoins\":true,\"gatherFood\":false,\"soloHunt\":{\"enabled\":true,\"type\":\"byTurn\",\"level\":\"1\",\"formationNum\":\"1\",\"attackType\":\"单次\",\"times\":\"6\"},\"rallyHunt\":{\"enabled\":false,\"type\":\"normal\",\"level\":\"0\",\"formationNum\":\"0\",\"chuizi\":{\"enabled\":false,\"times\":10,\"level\":0,\"formationNum\":1},\"juxing\":{\"enabled\":false,\"times\":10,\"level\":0,\"formationNum\":1},\"nanmin\":{\"enabled\":false,\"times\":10,\"formationNum\":1},\"heijun\":{\"enabled\":false,\"formationNum\":1}},\"getInBus\":{\"enabled\":false,\"chuizi\":{\"enabled\":false,\"times\":\"50\"},\"nanmin\":{\"enabled\":false,\"times\":\"10\"},\"heijun\":{\"enabled\":false,\"times\":\"50\"},\"juxing\":{\"enabled\":true,\"times\":\"3\"},\"formationNum\":\"8\"},\"events\":{\"oceanTreasure\":{\"enabled\":false,\"detectorNum\":\"2\"}},\"routine\":{\"enabled\":false}}");
  let s1 = parse.soloHunt.type.toString();
  let huntType = HuntType[s1 as keyof typeof HuntType];
  switch (huntType) {
    case HuntType.byTurn: //todo workaround
        myLog("")
        break;
  }
  myLog("")
})


function toOmnRegion(range: number[]): OmniRegion{
  return [range[0],range[1],range[2]-range[0], range[3]-range[1]]
}

test("去重",() => {

  const regex = /^[惧俱]*星[-+]?(\d+)$/;
  const testStrings = ['惧星', '俱星400', '具星-400', '非匹配字符串'];

  testStrings.forEach((s) => {
    const match = regex.exec(s);
    if (match) {
      console.log(`${s} 匹配成功`);
      // 如果需要获取匹配的数字，可以通过match数组的第二个元素获取
      const numberPart = match[1];
      console.log(`匹配到的数字: ${numberPart}`);
    } else {
      console.log(`${s} 不匹配`);
    }
  });
})

test("遍历时动态添加元素", () =>{
  let arr = [1,2,3]
  for (const item of arr) {
    console.log("item==> "+ item)
    if(item == 3){
      arr.push(4)
    }
    if(item == 4){
      arr.push(5)
    }
  }
});

test("找最小数", () =>{
  let result = [
    {"label": 151},
    {"label": 153},
    {"label": 164},
    {"label": 156}
  ]
  // let smallestNumberResult = result.reduce((min, current) => {
  //   const currentNumber = parseInt(String(current.label));
  //   if (!isNaN(currentNumber) && (min === null || currentNumber < parseInt(min.label))) {
  //     return current;
  //   }
  //   return min;
  // }, null as { label: string } | null);

})


test("找最小数22", () => {
  let result = [
    {"label": 151},
    {"label": 153},
    {"label": 164},
    {"label": 156}
  ]
  let smallestNumberResult = result.reduce<{ label: number } | null>((min, current) => {
    if (min === null || current.label < min.label) {
      return current;
    }
    return min;
  }, null);
  console.log(smallestNumberResult)
})


test("文字匹配", () => {
  let result = [
    {"label": "前往"},
    {"label": "再次挑战自 返回"}
  ]
  let againBtn = result.find(
      item=> item.label.includes("再次挑战")
  );
  if(againBtn) {
    //卡片标题和下面的前往btn 垂直坐标差160
    console.log(find)
  }

  let text = "我们q"
  console.log(text.includes("我们"))
})