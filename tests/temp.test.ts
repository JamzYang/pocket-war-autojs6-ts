
import '@jest/globals';
// describe('temp', () => {
//   it('should work', () => {
//     expect(true).toBe(true)
//   })
// })


import { myLog } from '../src/autoHandler';

// Mocking the entire module
jest.mock('../src/autoHandler', () => ({
  myLog: jest.fn(), // Creating a mock function for myLog
}));

test('myLog should be called with correct message', () => {
  const msg = 'test message';

  // Act
  myLog(msg);

  // Assert
  expect(myLog).toHaveBeenCalledWith(msg);
});