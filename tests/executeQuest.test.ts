import {CollectCoinsQuest} from "../src/types";
import {characterState, functionConfig} from "../src/config/config";
describe('execute action', () =>{
  it('should execute every steps in action',() =>{
    let collectCoinsAction = new CollectCoinsQuest();
    collectCoinsAction.execute(characterState, functionConfig);

  });
})