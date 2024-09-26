import {readTextFile} from "./autoHandler";

interface Filter {
  name: string;
  arg: string;
}

interface Config {
  img: string;
  width: string;
  height: string;
  firter: Filter[];
}

interface ParsedFilter {
  template: string;
  threshold: number;
  region: [number, number, number, number];
}

class TemplateParser {
  static parseFilter(filter: Filter, width: number, height: number): ParsedFilter {
    const argObj = JSON.parse(filter.arg.replace(/'/g, '"'));
    const template = argObj.template[0];
    const threshold = argObj.threshold;
    const rect = argObj.rect.split(',').map(Number);
    const region: [number, number, number, number] = [
      rect[0] * width,
      rect[1] * height,
      rect[2] * width - rect[0] * width,
      rect[3] * height - rect[1] * height
    ];

    return {
      template,
      threshold,
      region
    };
  }

  static parseFile(filePath: string): ParsedFilter[] {
    let data = readTextFile(filePath)
    const config: Config = JSON.parse(data);
    const width = parseInt(config.width);
    const height = parseInt(config.height);
    const parsedFilters = config.firter.map((filter) => this.parseFilter(filter, width, height));
    return parsedFilters
  }
}

// 导出 TemplateParser 类
export default TemplateParser;