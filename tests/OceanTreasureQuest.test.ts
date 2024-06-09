import {characterState, functionConfig} from "../src/config/config";
import {OceanTreasureQuest, RecognizeState, ToOceanTreasure} from "../src/oceanTreasure";
import * as autoHandler from "../src/autoHandler";
import {Step} from "../src/steps";

jest.mock('../src/config/env.conf', () => ({
  repeatSeconds: jest.fn().mockReturnValue(0.1)
}))

jest.mock('../src/configLoader', () => ({
  loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
}))

jest.mock('../src/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
  // fromBase64: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  // captureScreen: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  // findImage: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  // findMultiColor: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  myClick: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
  // matchTemplate: jest.fn(), // 默认 mock 函数
  ocrTextFromImg: jest.fn().mockReturnValue([{label:'战锤'}]),
  ocrText: jest.fn().mockReturnValue(['採测']),
  mySleep: jest.fn(),
}));

describe('OceanTreasureQuest', () => {
  it("execute", ()=>{
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });

    new TestOceanTreasureQuest(characterState, functionConfig).execute()
    const callCount = (autoHandler.ocrText as jest.Mock).mock.calls.length;
    expect(callCount).toBeGreaterThan(10);
  })
})

class TestOceanTreasureQuest extends OceanTreasureQuest {
  protected steps: Step[] = [
    new ToOceanTreasure(this),
    new RecognizeState(this)
  ]
}