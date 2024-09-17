import {FunctionConfig} from "./functionConfig";

export function loadFeatureConfig(): FunctionConfig {
  let storedConfig = storages.create("script_config").get("config");
  if (storedConfig) {
    return  storedConfig;
  }else {
    throw Error("读取配置失败")
  }
}
