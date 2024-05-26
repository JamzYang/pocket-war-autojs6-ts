
interface ParamParser {
  parseColorParam(colorPath: string): any;
}

class AjsParamParser implements ParamParser {
  public parseColorParam(colorPath: string):  [string, Array<[number, number, string]>, { region: OmniRegion, threshold: number }] {
    const indexes: number[] = []
    const regex = new RegExp(',', 'g')
    let match: RegExpExecArray | null

    while ((match = regex.exec(colorPath)) !== null) {
      indexes.push(match.index);
    }
    const kuohaoIndex =  colorPath.indexOf('{')
    const baseColor = colorPath.substring(indexes[0]+1, indexes[1]).replace(new RegExp('"', 'g'),'')
    const colors = JSON.parse(colorPath.substring(indexes[1]+1, kuohaoIndex-1))

    const a = colorPath.substring(kuohaoIndex)
    // const options = JSON.parse(input.substring(kuohaoIndex))
    // const options = eval("(" + input.substring(kuohaoIndex) + ")");

    //将region ,threshold 用 "" 包裹起来，以便于解析成json
    const regex2 = /(\w+):/g;
    const options = JSON.parse(
        colorPath.substring(kuohaoIndex)
        .replace(regex2, '"$1":')
        .replace(/("threshold":\[)(\d+)(\])/g, '"threshold":'+'$2')
    );

    // myLog("解析后的多点参数: baseColor ===>",JSON.stringify(baseColor));
    // myLog("colors ===>", JSON.stringify(colors));
    return [baseColor, colors, options]
  }
}

/**
 * 将综合图色助手 生成的 多点找色字符串解析成 autojs6的格式
 */
export function parseAjColorParam(colorPath: string):  [string, Array<[number, number, string]>, { region: OmniRegion, threshold: number }] {
  const parser = new AjsParamParser()
  return parser.parseColorParam(colorPath)
}

