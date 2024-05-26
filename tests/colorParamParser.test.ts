import {parseParam} from "../src/colorParamParser";


test('test parse color param', () => {
  // const [mat, baseColor, colors, offset1, offset2, rect, similarity] = parse("params");
  const params = parseParam("params");
  let p1 = params.at(0)

  console.log("test")
  expect(
      true,
  ).toBe(true)
})

