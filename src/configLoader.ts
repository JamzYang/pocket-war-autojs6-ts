// import * as fs from 'fs';
import {Quest, FunctionConfig, HuntType} from "./types";
import {functionConfig} from "./config/config";




export const featureConfig = loadFeatureConfig("");
function loadFeatureConfig(filePath: string): FunctionConfig {
  // const data = fs.readFileSync(filePath, 'utf-8');
  // return JSON.parse(data) as FunctionConfig;
  //todo 暂时写死,后面从文件中读取
  //返回一个空的配置
  console.log("loadFeatureConfig");
  let storedConfig = storages.create("FunctionConfig").get("config");
  console.log("main从本地存储读取配置："+storedConfig)
  if (storedConfig) {
    return  JSON.parse(storedConfig);
  }else {
    alert("读取配置失败，使用先运行`口袋小助手设置`");
    throw Error("读取配置失败")
  }
}
