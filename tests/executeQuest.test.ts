import {characterState, functionConfig} from "../src/config/config";
import * as autoHandler from '../src/helper/autoHandler';
import {EnemyName} from "../src/enum";
import {GetInBusQuest} from "../src/getInBus";
import {CollectCoinsQuest} from "../src/collectCoins";

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
  findMultiColor: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  myClick: jest.fn().mockReturnValue(true),
  clickPoint: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
  matchTemplate: jest.fn(), // 默认 mock 函数
  ocrTextFromImg: jest.fn().mockReturnValue([{label:'战锤'}]),
  ocrText: jest.fn().mockReturnValue(['战锤']),
  mySleep: jest.fn(),
}));

jest.mock('../src/helper/finder', () => ({
  hasCloseBtn: jest.fn().mockReturnValueOnce( { x: 100, y: 100 })
    .mockReturnValueOnce(null),
  hasBackBtn: jest.fn().mockReturnValueOnce({ x: 100, y: 100 })
    .mockReturnValueOnce(null),
}));


describe('execute action', () =>{
  beforeAll(() => {
    jest.doMock('../src/ocr', () => {
      return {
        orcRallyEnemyName: jest.fn().mockReturnValue(EnemyName.Chuizi)
      };
    });
  });


  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    // (myLog as jest.Mock).mockClear();
    // (fromBase64 as jest.Mock).mockClear();
    // (captureScreen as jest.Mock).mockClear();
    // (findImage as jest.Mock).mockClear();
    // (findMultiColor as jest.Mock).mockClear();
    jest.clearAllMocks()
  });

  afterEach(() => {
    // 在每个测试结束后，还原 mySwipe，以防止影响其他测试
    // autoHandler.myLog("").mockRestore();
  });


  //这个步骤中要反复调 findImage, 不好mock.先注释掉
/*  it('should execute every steps in action',() =>{
    const hasCloseBtnMock = jest.fn()
    .mockReturnValueOnce({ x: 100, y: 100 } as OpenCV.Point)
    .mockReturnValueOnce(null);

    let collectCoinsAction = new CollectCoinsQuest(characterState, functionConfig);
    collectCoinsAction.execute();

  });*/

  it('some step should repeat when fail on repeatable error', () => {
    (autoHandler.matchTemplate as jest.Mock).mockReturnValue({ matches: [], points: [] });
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    // (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    //第三次是为  ToRallyWindow step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValue(null);
    let getInBusQuest = new GetInBusQuest(characterState, functionConfig);
    getInBusQuest.execute();
    // expect(autoHandler.matchTemplate).toHaveBeenCalledTimes(100);
    const callCount = (autoHandler.matchTemplate as jest.Mock).mock.calls.length;
    expect(callCount).toBeGreaterThan(100);
  })


  it('some step should repeat when fail on repeatable error', () => {
    functionConfig.getInBus.enabled = true;
    functionConfig.getInBus.chuizi.enabled = true;
    functionConfig.getInBus.chuizi.times = 1;

    (autoHandler.matchTemplate as jest.Mock).mockReturnValue({ matches: [] });
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    //第三次是为  ToRallyWindow step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValue(null);
    //mock 上车 `+` 号的识别
    (autoHandler.matchTemplate as jest.Mock).mockReturnValue({matches: [{point:{x: 100, y: 100}}], points: [{x: 100, y: 100}]});

    // `+`号 卡片栏对应的怪名称
    // (ocr.orcRallyEnemyName as jest.Mock).mockReturnValue(EnemyName.Chuizi)
    // (autoHandler.ocrTextFromImg as jest.Mock).mockReturnValue();

    let getInBusQuest = new GetInBusQuest(characterState, functionConfig);
    let questResult = getInBusQuest.execute();
    getInBusQuest.postExecute(questResult)
    // expect(autoHandler.matchTemplate).toHaveBeenCalledTimes(100);
    const callCount = (autoHandler.matchTemplate as jest.Mock).mock.calls.length;
    expect(callCount).toBe(1);
    expect(functionConfig.getInBus.chuizi.times).toBe(0);
  })

})