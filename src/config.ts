import {CharacterState, FunctionConfig, HuntType} from "./types";

export const characterState: CharacterState = {
  stamina: 0,
  totalTeams: 0,
  idleTeams: 0,
  lastCoinCollectionTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
};

export const functionConfig: FunctionConfig = {
  collectCoins: false,
  gatherFood: false,
  soloHunt: {
    enabled: false,
    type: HuntType.Normal,
    level: 1
  },
  rallyHunt: false
};