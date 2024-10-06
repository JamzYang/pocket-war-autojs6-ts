export type Point = {
  x: number;
  y: number;
};

export type PointConfig = {
  [key: string]: Point;
};

export const pointConfig: PointConfig = {
 //========================主界面========================
 mainCityWorldBtn: {x: 630, y: 1200},
 mainSearchBtn: {x: 80, y: 1200},
 packageStoreBtn: {x: 580, y: 40},
 coinBar: {x: 220, y: 25},
 coinHarvester: {x: 220, y: 1040},
 coinHarvestIcon: {x: 360, y: 585},
 unionIcon: {x: 660, y: 856},
 valueEventsIcon: {x: 656, y:345},
 currentCoordinateBar: {x:120, y:250},
 //军情
 intelligenceIcon: {x: 47, y: 1072},
 //========================联盟窗口======================
 unionEventIcon: {x: 186, y: 727},
 warIcon: {x: 200, y: 1000},


 //========================联盟活动======================
 //联盟活动页 机甲卡片中心
 unionEventMechs: {x: 360, y: 240},
 unionMechDonateBtn: {x: 360, y: 1205},



 //=======================搜索界面========================
 searchRallyTab: {x: 110, y: 575},
 /**
  *搜索界面资源田
  */
 searchResourceTab: {x: 280, y: 575},
 //搜索 tab页,资源位: 油,田. 敌军: 陆 海 军等
 searchTabLeftPos: {x: 130, y: 780},
 searchTabMidPos: {x: 350, y: 780},
 searchTabRightPos: {x: 600, y: 780},

 searchOilPic: {x: 350, y: 780},
 searchGoldMinePic: {x: 130, y: 780},
 searchFarmLandPic: {x: 600, y: 780},
 searchEnemyTab: {x: 460, y: 575},
 searchTreasureTab: {x: 640, y: 575},
 searchLevelPlusIcon: {x: 550, y: 1085},
 searchLevelMinusIcon: {x: 170, y: 1085},
 searchConfirmSearchBtn: {x: 365, y: 1182},

 /**
  * 搜索界面敌军
  */
 searchSoloEnemyTab: {x: 92, y: 575},
 searchRallyEnemyTab: {x: 450, y: 575},
 // 目标格子. 陆海空, 金油农
 searchFirstCell: {x: 130, y: 780},
 searchSecondCell: {x: 350, y: 780},
 searchThirdCell: {x: 600, y: 780},
 searchRightCell: {x: 0, y: 0}, //todo

 targetCenter: {x:360,y:640},
 searchAttackBtn:{x: 360, y: 1115},
 attack5TimesBtn:{x: 228, y: 460},
 attack1TimeBtn:{x:494,y: 460},
 rallyJuXingBtn:{x:230,y: 1030},
 //========================出征界面========================
 oneClickBattleBtn: {x: 655, y: 1005},
 formationNum1: {x: 325, y: 1075},
 formationNum2: {x: 377, y: 1075},
 formationNum3: {x: 429, y: 1075},
 formationNum4: {x: 481, y: 1075},
 formationNum5: {x: 533, y: 1075},
 formationNum6: {x: 585, y: 1075},
 formationNum7: {x: 637, y: 1075},
 formationNum8: {x: 689, y: 1075},
 confirmBattleBtn: {x: 355, y: 510},
 //退出出征窗口
 exitBattleBtn: {x:43, y:63},
 exitBattleConfirmBtn: {x:508, y:745},

 //无集结队伍 子窗口
 rallyNoBusWindowCloseBtn: {x: 650, y: 140},

 //远程行动 快速战斗
 expeditionFastBattleBtn: {x: 605, y: 1187},
 expeditionFreeFastBattleBtn: {x: 360,y: 890},
 expeditionCollectRewards: {x: 212,y: 1065},
 expeditionConfirmCollect: {x: 360,y: 1126},

 //免费钻石
 weeklyMemberTab: {x: 505, y: 130},
 takeDiamondBtn: {x: 590, y: 293},
};
