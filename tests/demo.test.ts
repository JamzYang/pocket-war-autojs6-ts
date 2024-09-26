import {GatherType} from "../src/enum";
import {FunctionConfig} from "../src/core/functionConfig";
import TemplateParser from "../src/helper/templateParser";
describe('SelectCommanderSolider', () => {
  it("transfer ui config to ts config", ()=>{
      //将下面的 UIConfig 解析成 FunctionConfig
    let funcConfig: FunctionConfig = JSON.parse(JSON.stringify(UIConfig));
    console.log(funcConfig);
  }),

  it("parse template", ()=>{
    let filters = TemplateParser.parseFile("./src/config/events/矿产大亨/template.cv");
    console.log(filters);
  })
})

function mergeConfig(initialConfig, storedConfig) {
  for (let key in initialConfig) {
    if (initialConfig.hasOwnProperty(key)) {
      if (typeof initialConfig[key] === 'object' && !Array.isArray(initialConfig[key])) {
        if (!storedConfig[key]) {
          storedConfig[key] = {};
        }
        mergeConfig(initialConfig[key], storedConfig[key]);
      } else {
        if (storedConfig[key] === undefined) {
          storedConfig[key] = initialConfig[key];
        }
      }
    }
  }
}


const UIConfig = {
  freeDiamond: false,
  collectCoins: false,
  expedition: false,
  soloHunt: {
    enabled: false,
    type: "左一",
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
  gather: {
    enabled: false,
    team1: { enabled: false, formationNum: "1", type:GatherType.Oil },
    team2: { enabled: false, formationNum: "2", type:GatherType.Food },
    team3: { enabled: false, formationNum: "3", type:GatherType.Oil },
    team4: { enabled: false, formationNum: "4", type:GatherType.Food },
    team5: { enabled: false, formationNum: "0", type:GatherType.Oil },
    team6: { enabled: false, formationNum: "0", type:GatherType.Oil },
    team7: { enabled: false, formationNum: "0", type:GatherType.Oil },
    team8: { enabled: false, formationNum: "0", type:GatherType.Oil },
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