
interface ParamParser {
  parseColorParam(colorPath: string): any;
}

class AjsParamParser implements ParamParser {
  public parseColorParam(colorPath: string):  [string, Array<[number, number, string]>, { region: OmniRegion, threshold: number }] {
    let input = colorPath.replace(new RegExp('"', 'g'),'') //todo
    const indexes: number[] = []
    const regex = new RegExp(',', 'g')
    let match: RegExpExecArray | null

    while ((match = regex.exec(input)) !== null) {
      indexes.push(match.index);
    }
    const kuohaoIndex =  input.indexOf('{')
    const baseColor = input.substring(indexes[0]+1, indexes[1]).replace(new RegExp('"', 'g'),'')
    const colors = JSON.parse(input.substring(indexes[1]+1, kuohaoIndex-1))

    const a = input.substring(kuohaoIndex)
    // const options = JSON.parse(input.substring(kuohaoIndex))
    // const options = eval("(" + input.substring(kuohaoIndex) + ")");

    //将region ,threshold 用 "" 包裹起来，以便于解析成json
    const regex2 = /(\w+):/g;
    const options = JSON.parse(
        input.substring(kuohaoIndex)
        .replace(regex2, '"$1":')
        .replace(/("threshold":\[)(\d+)(\])/g, '"threshold":'+'$2')
    );

    // console.log("解析后的多点参数: baseColor ===>",JSON.stringify(baseColor));
    // console.log("colors ===>", JSON.stringify(colors));
    return [baseColor, colors, options]
  }
}

export function parseAjColorParam(colorPath: string):  [string, Array<[number, number, string]>, { region: OmniRegion, threshold: number }] {
  const parser = new AjsParamParser()
  return parser.parseColorParam(colorPath)
}

