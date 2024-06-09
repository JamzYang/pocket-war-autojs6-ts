import {OceanTreasureQuest} from "./oceanTreasure";
import {
  CharacterState,
  CollectCoinsQuest,
  FunctionConfig,
  GatherFoodQuest, GetInBusQuest,
  NullQuest,
  Quest,
} from "./types";
import {RallyHuntQuest, SoloHuntQuest} from "./hunt";

export const ActionClassMap: { [key: string]: new (characterState: CharacterState, functionConfig: FunctionConfig) => Quest } = {
  NullQuest: NullQuest,
  SoloHuntQuest: SoloHuntQuest,
  RallyHuntQuest: RallyHuntQuest,
  CollectCoinsQuest: CollectCoinsQuest,
  GatherFoodQuest: GatherFoodQuest,
  GetInBusQuest: GetInBusQuest,
  OceanTreasureQuest: OceanTreasureQuest,
};