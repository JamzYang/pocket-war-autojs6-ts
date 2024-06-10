import {FunctionConfig} from "./functionConfig";

export function loadFeatureConfig(): FunctionConfig {
  let storedConfig = storages.create("FunctionConfig").get("config");
  console.log("main读取配置："+storedConfig)
  if (storedConfig) {
    return  JSON.parse(storedConfig);
  }else {
    alert("读取配置失败，使用先运行`口袋小助手设置`");
    throw Error("读取配置失败")
  }
}
