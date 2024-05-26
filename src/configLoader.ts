// import * as fs from 'fs';
import {Quest, FunctionConfig, HuntType} from "./types";

export interface RuleConfig {
  conditions: { [key: string]: any };
  action: string;
}

export interface Config {
  rules: RuleConfig[];
}

export function loadConfig(filePath: string): Config {
  // const data = fs.readFileSync(filePath, 'utf-8');
  //todo
  const data = "{}";
  return JSON.parse(data) as Config;
}

export const featureConfig = loadFeatureConfig("");

function loadFeatureConfig(filePath: string): FunctionConfig {
  // const data = fs.readFileSync(filePath, 'utf-8');
  // return JSON.parse(data) as FunctionConfig;
  //todo 暂时写死,后面从文件中读取
  return  {
    collectCoins: true,
    gatherFood: true,
    soloHunt: {
      enabled: true,
      type: HuntType.Normal,
      level: 1
    },
    rallyHunt: false
  };
}
