import * as autoHandler from '../src/autoHandler';
export const myLogMock = jest.fn();
export const myLogSpy = jest.spyOn(autoHandler, 'myLog').mockImplementation(() => myLogMock());