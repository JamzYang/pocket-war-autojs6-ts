import {CollectCoinsQuest} from "../src/types";
import {characterState, functionConfig} from "../src/config/config";
import {myLog, fromBase64, captureScreen, findImage,
  findMultiColor,myClick,mySwipe}  from '../src/autoHandler';
import { myLogMock, myLogSpy } from './autoHandler.mock';

import {hasCloseBtn, hasBackBtn} from '../src/finder'

jest.mock('../src/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
  fromBase64: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  captureScreen: jest.fn().mockReturnValue({ width: 720, height: 1280}),
  findImage: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  findMultiColor: jest.fn().mockReturnValue({ x: 100, y: 100 }),
  myClick: jest.fn().mockReturnValue(true),
  mySwipe: jest.fn().mockReturnValue(true),
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
    (myLog as jest.Mock).mockClear();
    (fromBase64 as jest.Mock).mockClear();
    (captureScreen as jest.Mock).mockClear();
    (findImage as jest.Mock).mockClear();
    (findMultiColor as jest.Mock).mockClear();
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
})