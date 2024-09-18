import * as console from "console";

function mergeConfigs(storedConfig, initialConfig) {
  var mergedConfig = {};

  for (var key in storedConfig) {
    if (storedConfig.hasOwnProperty(key)) {
      mergedConfig[key] = storedConfig[key];
    }
  }

  for (var key in initialConfig) {
    if (initialConfig.hasOwnProperty(key)) {
      if (!mergedConfig.hasOwnProperty(key)) {
        mergedConfig[key] = initialConfig[key];
      } else if (Array.isArray(initialConfig[key])) {
        // 如果是数组，保留storedConfig中的数组
        mergedConfig[key] = storedConfig[key] || initialConfig[key];
      } else if (typeof initialConfig[key] === 'object' && initialConfig[key] !== null) {
        mergedConfig[key] = mergeConfigs(mergedConfig[key] || {}, initialConfig[key]);
      }
    }
  }

  return mergedConfig;
}

describe('mergeConfigs', () => {
  test('应该合并顶层属性', () => {
    const stored = { a: 1, b: 2 };
    const initial = { b: 3, c: 4 };
    const result = mergeConfigs(stored, initial);
    expect(result).toEqual({ a: 1, b: 2, c: 4 });
  });

  test('应该深度合并嵌套对象', () => {
    const stored = { a: { x: 1 }, b: 2 };
    const initial = { a: { y: 2 }, c: 3 };
    const result = mergeConfigs(stored, initial);
    expect(result).toEqual({ a: { x: 1, y: 2 }, b: 2, c: 3 });
  });

  test('应该保留stored中的值', () => {
    const stored = { a: 1, b: { x: 10 } };
    const initial = { a: 2, b: { x: 20, y: 30 } };
    const result = mergeConfigs(stored, initial);
    expect(result).toEqual({ a: 1, b: { x: 10, y: 30 } });
  });

  test('应该处理空对象', () => {
    const stored = {};
    const initial = { a: 1, b: 2 };
    const result = mergeConfigs(stored, initial);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test('应该处理复杂嵌套结构', () => {
    const stored = {
      a: 1,
      b: { x: 10, y: { m: 100 } },
      c: [1, 2, 3]
    };
    const initial = {
      b: { y: { n: 200 }, z: 30 },
      c: [4, 5],
      d: 4
    };
    const result = mergeConfigs(stored, initial);
    expect(result).toEqual({
      a: 1,
      b: { x: 10, y: { m: 100, n: 200 }, z: 30 },
      c: [1, 2, 3],
      d: 4
    });
  });

  test('真实数据',() =>{
    const stored = {"collectCoins":true,"expedition":false,"soloHunt":{"enabled":true,"type":"黑暗陆军","attackType":"单杀","times":"1","formationNum":"1"},"rallyHunt":{"enabled":true,"chuizi":{"enabled":true,"times":"2","formationNum":"1"},"juxing":{"enabled":false,"times":10,"formationNum":"1"},"right":{"enabled":false,"times":10,"formationNum":"1"}},"getInBus":{"enabled":true,"chuizi":{"enabled":true,"times":"50"},"heijun":{"enabled":true,"times":"50"},"nanmin":{"enabled":true,"times":"10"},"juxing":{"enabled":true,"times":"10"},"formationNum":"2"},"events":{"oceanTreasure":{"enabled":false,"detectorNum":"3"}}}
    const result = mergeConfigs(stored, initial);
    let bbb = JSON.stringify(mergeConfigs(stored, initial))
    console.log(bbb);
  });
});

const initial = {
  collectCoins: false,
  expedition: false,
  soloHunt: {
    enabled: false,
    type: "黑暗陆军",
    attackType: "五连",
    times: 1,
    formationNum: "1"
  },
  rallyHunt: {
    enabled: false,
    chuizi: {
      enabled: false,
      times: 1,
      level: 0,
      formationNum: 1
    },
    juxing: {
      enabled: false,
      times: 10,
      level: 0,
      formationNum: 1
    },
    right: {
      enabled: false,
      times: 10,
      level: 0,
      formationNum: 1
    },
    nanmin: {
      enabled: false,
      times: 10,
      formationNum: 1
    },
    heijun: {
      enabled: false,
      formationNum: 1
    },
  },
  getInBus: {
    enabled: false,
    chuizi: {
      enabled: false,
      times: "50"
    },
    heijun: {
      enabled: false,
      times: "50"
    },
    nanmin: {
      enabled: false,
      times: "10"
    },
    juxing: {
      enabled: false,
      times: "10"
    },
    formationNum: "1"
  },
  events: {
    oceanTreasure: {
      enabled: false,
      detectorNum: "3"
    }
  }
};