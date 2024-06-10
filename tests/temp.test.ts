
import '@jest/globals';
// describe('temp', () => {
//   it('should work', () => {
//     expect(true).toBe(true)
//   })
// })


import { myLog } from '../src/helper/autoHandler';

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
});


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