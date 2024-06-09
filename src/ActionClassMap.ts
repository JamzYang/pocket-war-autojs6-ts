import {OceanTreasureQuest} from "./oceanTreasure";
import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest, GetInBusQuest,
  NullQuest,
  Quest,
  SoloHuntQuest
} from "./types";

export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
  GetInBusQuest: GetInBusQuest,
  OceanTreasureQuest: OceanTreasureQuest,
};