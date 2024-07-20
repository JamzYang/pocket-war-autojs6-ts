// config.js
const initialConfig = {
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
      times: 10,
      formationNum: "1"
    },
    juxing: {
      enabled: false,
      times: 10,
      formationNum: "1"
    },
    right: {
      enabled: false,
      times: 10,
      formationNum: "1"
    }
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

const formationOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];
const soloHuntEnemyOptions = ["黑暗陆军", "黑暗海军", "黑暗空军", "三军轮流", "最右边"];
const soloHuntAttackTypeOptions = ["五连", "单次"];
const detectorNumOptions = ["1", "2", "3"];
const rallyHuntItems = {
  chuizi: { label: '锤子' },
  juxing: { label: '惧星' },
  right: { label: '最后一格' }
};
const getInBusItems = {
  chuizi: { label: '锤子' },
  heijun: { label: '黑暗军团' },
  nanmin: { label: '难民' },
  juxing: { label: '惧星' }
};
