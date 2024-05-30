import {CollectCoinsQuest, GetInBusQuest} from "../src/types";
import {characterState, functionConfig} from "../src/config/config";
// import {
//   myLog, fromBase64, captureScreen, findImage,
//   findMultiColor, myClick, mySwipe, matchTemplate
// } from '../src/autoHandler';
import { myLogMock, myLogSpy } from './autoHandler.mock';
import * as autoHandler from '../src/autoHandler';
import {hasCloseBtn, hasBackBtn} from '../src/finder'
import * as process from "process";

jest.mock('dotenv', () => ({config: () => {}}))
jest.mock('../src/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
  fromBase64: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  captureScreen: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  findImage: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  findMultiColor: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  myClick: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
  matchTemplate: jest.fn() // 默认 mock 函数
}));

jest.mock('../src/finder', () => ({
  hasCloseBtn: jest.fn().mockReturnValueOnce( { x: 100, y: 100 })
    .mockReturnValueOnce(null),
  hasBackBtn: jest.fn().mockReturnValueOnce({ x: 100, y: 100 })
    .mockReturnValueOnce(null),
}));

describe('execute action', () =>{
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


  it('should execute every steps in action',() =>{
    const hasCloseBtnMock = jest.fn()
    .mockReturnValueOnce({ x: 100, y: 100 } as OpenCV.Point)
    .mockReturnValueOnce(null);

    let collectCoinsAction = new CollectCoinsQuest();
    collectCoinsAction.execute(characterState, functionConfig);

  });

  it('some step should repeat when fail on repeatable error', () => {
    process.env.REPEAT_SECONDS_MULTIPLE_OF_50 = '0.1';
    (autoHandler.matchTemplate as jest.Mock).mockReturnValue({ matches: [] });
    //前两次mock是 ToWorld step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    (autoHandler.findMultiColor as jest.Mock).mockReturnValueOnce({x: 100, y: 100 });
    //第三次是为  ToRallyWindow step
    (autoHandler.findMultiColor as jest.Mock).mockReturnValue(null);
    // (autoHandler.findMultiColor as jest.Mock).mockReturnValue(null);
    let getInBusQuest = new GetInBusQuest();
    getInBusQuest.execute(characterState, functionConfig);
    // expect(autoHandler.matchTemplate).toHaveBeenCalledTimes(100);
    const callCount = (autoHandler.matchTemplate as jest.Mock).mock.calls.length;
    expect(callCount).toBeGreaterThan(100);

  })

})