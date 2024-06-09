import {OceanTreasureQuest} from "../oceanTreasure";

import {RallyHuntQuest, SoloHuntQuest} from "../hunt";
import {CharacterState} from "../core/characterState";
import {FunctionConfig} from "../core/functionConfig";
import {NullQuest, Quest} from "../core/quest";
import {CollectCoinsQuest} from "../collectCoins";
import {GatherFoodQuest} from "../gather";
import {GetInBusQuest} from "../getInBus";

export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  RallyHuntQuest: RallyHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
  GetInBusQuest: GetInBusQuest,
  OceanTreasureQuest: OceanTreasureQuest,
};