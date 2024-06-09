import * as autoHandler from '../src/helper/autoHandler';
export const myLogMock = jest.fn();
export const myLogSpy = jest.spyOn(autoHandler, 'myLog').mockImplementation(() => myLogMock());