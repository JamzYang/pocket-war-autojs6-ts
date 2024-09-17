import {characterState, functionConfig} from "../src/config/config";
import * as autoHandler from "../src/helper/autoHandler";
import {SelectSoloEnemy, SoloHuntQuest} from "../src/hunt";
import {AttackEnemy} from "../src/steps";
import {SelectCommanderSolider} from "../src/selectFormation";
import {Step} from "../src/core/step";

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
  matchTemplate: jest.fn(), // 默认 mock 函数
  ocrTextFromImg: jest.fn().mockReturnValue([{label:'战锤'}]),
  ocrText: jest.fn().mockReturnValue(['採测']),
  mySleep: jest.fn(),
}));

describe('打野单刷', () => {
  it("单杀1次后, 次数变为0", ()=>{
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.matchTemplate as jest.Mock).mockReturnValue({ matches: [], points: [] });
    functionConfig.soloHunt.enabled = true;
    functionConfig.soloHunt.times = 1;
    let testSoloHuntQuest = new TestSoloHuntQuest(characterState,functionConfig);
    testSoloHuntQuest.execute()
    testSoloHuntQuest.postExecute()
    expect(functionConfig.soloHunt.times).toBe(0)
  })
})

/**
 * 测试类. 步骤相较于 SoloHuntQuest 少了一些
 */
class TestSoloHuntQuest extends SoloHuntQuest {
  protected steps: Step[] = [
    new SelectSoloEnemy(this),
    new AttackEnemy(this),
    new SelectCommanderSolider(this),
  ]
}