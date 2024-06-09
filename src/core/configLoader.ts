import {FunctionConfig} from "../types";

 export function loadFeatureConfig(): FunctionConfig {
  console.log("loadFeatureConfig");
  let storedConfig = storages.create("FunctionConfig").get("config");
  // console.log("main从本地存储读取配置："+storedConfig)
  if (storedConfig) {
    return  JSON.parse(storedConfig);
  }else {
    alert("读取配置失败，使用先运行`口袋小助手设置`");
    throw Error("读取配置失败")
  }
}
