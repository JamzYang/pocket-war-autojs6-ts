import {characterState, functionConfig} from "../src/config/config";
import {OceanTreasureQuest, RecognizeAndPick, ToOceanTreasure, orcCountDown} from "../src/oceanTreasure";
import * as autoHandler from "../src/helper/autoHandler";
import {Step} from "../src/core/step";
import {myToast} from "../src/helper/autoHandler";
import * as console from "console";

jest.mock('../src/config/env.conf', () => ({
  repeatSeconds: jest.fn().mockReturnValue(0.1)
}))

jest.mock('../src/core/configLoader', () => ({
  loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
}))

jest.mock('../src/helper/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
  fromBase64: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  captureScreen: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  findImage: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  findMultiColor: jest.fn(),
  myClick: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
  // matchTemplate: jest.fn(), // 默认 mock 函数
  ocrTextFromImg: jest.fn().mockReturnValue([{label:'战锤'}]),
  ocrText: jest.fn().mockReturnValue(['採测']),
  ocrDetect: jest.fn().mockReturnValue(
      [{"label":"採侧側计时","confidence":0.50078124,bounds:{"x":92,"y":1010,"width":205,"height":1031}},{"label":"07:29:53","confidence":0.74658203,bounds:{"x":101,"y":1038,"width":197,"height":1059}},{"label":"立即完成","confidence":0.6796875,bounds:{"x":100,"y":1066,"width":196,"height":1091}},{"label":"探测倒计时","confidence":0.621875,bounds:{"x":293,"y":1009,"width":425,"height":1034}},{"label":"07:29:54","confidence":0.8066406,bounds:{"x":311,"y":1037,"width":409,"height":1059}},{"label":"立即完成","confidence":0.7109375,bounds:{"x":314,"y":1069,"width":411,"height":1090}}]
  ),
  mySleep: jest.fn(),
}));

describe('OceanTreasureQuest', () => {
  it("execute", () => {
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100});
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100});

    new TestOceanTreasureQuest(characterState, functionConfig).execute()
    const callCount = (autoHandler.ocrText as jest.Mock).mock.calls.length;
    expect(callCount).toBeGreaterThan(10);
  })

  it("倒计时识别", () => {
    const {timeStr, seconds, type} = orcCountDown()
    expect(timeStr).toBe('07:29:53');
    let nextExecuteTime = new Date(new Date().getTime() + seconds * 1000);
    let nextExecuteTimeStr = nextExecuteTime.toTimeString().split(' ')[0];
    console.log("深海下次收取时间：" + nextExecuteTimeStr)
  })
})


class TestOceanTreasureQuest extends OceanTreasureQuest {
  protected steps: Step[] = [
    new ToOceanTreasure(this),
    new RecognizeAndPick(this)
  ]
}