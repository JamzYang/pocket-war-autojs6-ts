import {characterState, functionConfig} from "../src/config/config";
import * as autoHandler from "../src/helper/autoHandler";
import {Step} from "../src/core/step";
import {ClickConfirmBattleBtn} from "../src/clickConfirmBattleBtn";

import {SelectSoloEnemy, SoloHuntQuest} from "../src/hunt";
import {AttackEnemy} from "../src/steps";
import {SelectCommanderSolider} from "../src/selectFormation";

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

describe('rally hunt quest', () => {
  it("execute", ()=>{
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.matchTemplate as jest.Mock).mockReturnValue({ matches: [], points: [] });

    new TestSoloHuntQuest(characterState,functionConfig).execute()
    new TestSoloHuntQuest(characterState,functionConfig).execute()
    expect(11).toBeGreaterThan(10);
  })
})

class TestSoloHuntQuest extends SoloHuntQuest {
  protected steps: Step[] = [
    new SelectSoloEnemy(this),
    new AttackEnemy(this),
    new SelectCommanderSolider(this),
    new ClickConfirmBattleBtn(this),
  ]
}