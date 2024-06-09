import {characterState, functionConfig} from "../src/config/config";
import {OceanTreasureQuest, RecognizeState, ToOceanTreasure} from "../src/oceanTreasure";
import * as autoHandler from "../src/autoHandler";
import {ClickCoinPoll, Step} from "../src/steps";
import {CollectCoinsQuest, Quest} from "../src/types";
import {loadRuleConfig} from "../src/condition";
import {run} from "../src/ruleEngine";
import {myLog} from "../src/autoHandler";

jest.mock('../src/config/env.conf', () => ({
  repeatSeconds: jest.fn().mockReturnValue(0.1)
}))

jest.mock('../src/configLoader', () => ({
  loadFeatureConfig: jest.fn().mockReturnValue(functionConfig)
}))

jest.mock('../src/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
  fromBase64: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  captureScreen: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  findImage: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  findMultiColor: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  myClick: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
  // matchTemplate: jest.fn(), // 默认 mock 函数
  ocrTextFromImg: jest.fn().mockReturnValue([{label:'战锤'}]),
  ocrText: jest.fn().mockReturnValue(['採测']),
  mySleep: jest.fn(),
}));

describe('CollectCoinsQuest', () => {
  it("execute", ()=>{
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });

    new TestCollectCoinsQuest(characterState, functionConfig).execute()
    const callCount = (autoHandler.ocrText as jest.Mock).mock.calls.length;
    expect(callCount).toBeGreaterThan(10);
  })

  it('should gen oceanTreasureQuest when treasure is enabled', () => {
    characterState.stamina =30;
    characterState.idleTeams = 0;
    functionConfig.gatherFood = true;
    functionConfig.collectCoins = true
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled= true;
    functionConfig.getInBus.chuizi.times = 1;
    functionConfig.events.oceanTreasure.enabled = false;
    let ruleConfig = loadRuleConfig()

    while(true){
      let quests = run(ruleConfig,characterState, functionConfig)
      let quest = quests[0]
      if(quests.length == 0){
        myLog("没有任务")
        sleep(2000)
        return
      }
      quest.execute()
      quest.postExecute()
    }
  });
})

class TestCollectCoinsQuest extends CollectCoinsQuest {
  // protected steps: Step[] = [
  //   new ClickCoinPoll(this)
  // ]
}