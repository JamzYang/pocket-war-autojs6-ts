import * as autoHandler from "../src/helper/autoHandler";
import {characterState, functionConfig} from "../src/config/config";
import {SelectCommanderSolider} from "../src/selectFormation";
import {SoloHuntQuest} from "../src/hunt"
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
  mySleep: jest.fn(),
}));


describe('SelectCommanderSolider', () => {
  it("execute", ()=>{
    functionConfig.soloHunt.formationNum = 1;
    new SelectCommanderSolider(new SoloHuntQuest(characterState,functionConfig)).execute(characterState,functionConfig);
  })
})