import {parseAjColorParam} from "../src/ParamParser";
import {colorConfig} from "../src/colorConfig";

// "autojs/626/1208",
// "#949ca9",
// [[-37,-33,"#f26155"],[-28,-52,"#d74b41"],[36,-37,"#949ca9"],[72,16,"#78a5cc"],[2,-9,"#ace8f9"],[-2,50,"#d5d5d1"]],
// {region:[576,1171,127,105],threshold:[26]}
test('test parse color param', () => {
  const params = parseAjColorParam(colorConfig.mainWindow.mainCityColor);
  let p1 = params.at(0)
  expect(params).toBeInstanceOf(Array)
  expect(params[0]).toEqual("#949ca9")
  expect(params[1]).toEqual([[-37,-33,"#f26155"],[-28,-52,"#d74b41"],[36,-37,"#949ca9"],[72,16,"#78a5cc"],[2,-9,"#ace8f9"],[-2,50,"#d5d5d1"]])
  expect(params[2]).toEqual({region: [576, 1171, 127, 105], threshold: 26})
})

