import {Quest} from "./quest";

export interface CharacterState {
  stamina: number; // 体力
  totalTeams: number; // 队伍总数量
  idleTeams: number; // 空闲队伍
  lastQuests: Map<string, Quest>;
}
