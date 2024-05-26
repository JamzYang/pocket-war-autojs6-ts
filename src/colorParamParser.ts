// import * as fs from 'fs';
import {colorConfig}  from "./config/colorConfig";
import {myLog} from "./autoHandler";

// 定义函数的参数类型接口
interface Params {
  baseColor: string;
  colors: string[];
  offset1: number;
  offset2: number;
  rect: number[];
  similarity: number;
}

// 读取配置文件的函数
const configPath = './src/colorConfig.json';

// function readConfig(filePath: string): any {
//   myLog("Current working directory:", process.cwd());
//
//   const data = fs.readFileSync(filePath, 'utf-8');
//   // const config = JSON.parse(data);
//   // return config.params;
//   return JSON.parse(data);
// }


// 将参数字符串解析为实际的参数
export function parseParam(key: string): [string, string[], number, number, number[], number] {
  // let paramStr =  getConfigValue(key)
  let paramStr =  colorConfig.mainWindow.mainCityColor
  // 创建一个新的函数解析参数字符串
  // 去除参数中的 "mat," 前缀
  const paramsWithoutMat = paramStr.replace(/^mat,/, '');

  // 将参数字符串解析为实际参数
  const parsedParams = eval(`[${paramsWithoutMat}]`);

  if(parsedParams === undefined) {
    throw new Error(`Failed to parse colors from input key: ${key}`);
  }

  // parseParams 中任一元素为 underfined ,就抛异常
  for (let i = 0; i < parsedParams.length; i++) {
    if (parsedParams[i] === undefined) {
      throw new Error(`Invalid colors format in input string: ${parsedParams}`);
    }
  }

  return parsedParams
  }


// function getConfigValue(key: string): string{
//   let config = readConfig(configPath);
//   return  config[key]
// }

// 定义 findMultiColor 方法
function findMultiColor(
    mat: any,  // 假设 'mat' 是某种类型，如果已知，请替换 'any'
    baseColor: string,
    colors: string[],
    offset1: number,
    offset2: number,
    rect: number[],
    similarity: number
): any[] {  // 替换 'any[]' 为正确的返回类型
  // 方法实现
  // myLog("Called findMultiColor with parameters:", {
  //   baseColor, colors, offset1, offset2, rect, similarity
  // });
  return [];  // 占位返回
}
