"ui";

var color = "#009688";
const formationOptionsStr = "1|2|3|4|5|6|7|8"
const detectorNumOptionsStr = "1|2|3"
const soloHuntEnemyOptionsStr = "黑暗陆军|黑暗海军|黑暗海军|三军轮流|最右边"
const soloHuntAttackTypeOptionsStr =  "五连|单次"
const rallyHuntEnemyOptionsStr =  "锤子|右数第二|最右边"
var FunctionConfig = {
  collectCoins: false,
  expedition: false,
  gatherFood: false,
  soloHunt: {
    enabled: false,
    type: "normal",
    attackType: "五连",
    level: "1",
    formationNum: "1"
  },
  rallyHunt: {
    enabled: false,
    chuizi: {
      enabled: false,
      times: 10,
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
    enabled: true,
    chuizi: {
      enabled: false,
      times: "50"
    },
    nanmin: {
      enabled: false,
      times: "10"
    },
    heijun: {
      enabled: false,
      times: "50"
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
    },
  },
  routine: {
    enabled: false,
  },
};


// 从本地存储中读取数据
// storages.remove("FunctionConfig");
var storedConfig = storages.create("script_config").get("config");
// console.log("从本地存储读取配置："+storedConfig)
if (storedConfig) {
  let storedConfigParsed = JSON.parse(storedConfig);
  mergeConfig(FunctionConfig, storedConfigParsed);
  FunctionConfig = storedConfigParsed;
}

function updateStorage(){
  console.log("更新存储："+JSON.stringify(FunctionConfig))
  storages.create("FunctionConfig").put("config", JSON.stringify(FunctionConfig));
}

// 合并存储的配置和默认配置
function mergeConfig(defaultConfig, storedConfig) {
  for (let key in defaultConfig) {
    if (defaultConfig.hasOwnProperty(key)) {
      if (typeof defaultConfig[key] === 'object' && !Array.isArray(defaultConfig[key])) {
        if (!storedConfig[key]) {
          storedConfig[key] = {};
        }
        mergeConfig(defaultConfig[key], storedConfig[key]);
      } else {
        if (storedConfig[key] === undefined) {
          storedConfig[key] = defaultConfig[key];
        }
      }
    }
  }
}

function updateConfig() {
  FunctionConfig.getInBus.enabled = ui.enableFollowCar.isChecked();
  FunctionConfig.getInBus.chuizi.enabled = ui.enableChuizi.isChecked();
  FunctionConfig.getInBus.chuizi.times = ui.chuiziTimes.getText();
  FunctionConfig.getInBus.heijun.enabled = ui.enableHeiJun.isChecked();
  FunctionConfig.getInBus.heijun.times = ui.heiJunTimes.getText();
  FunctionConfig.getInBus.nanmin.enabled = ui.enableNanmin.isChecked();
  FunctionConfig.getInBus.nanmin.times = ui.nanminTimes.getText();
  FunctionConfig.getInBus.juxing.enabled = ui.enableJuxing.isChecked();
  FunctionConfig.getInBus.juxing.times = ui.juxingTimes.getText();
  FunctionConfig.events.oceanTreasure.enabled = ui.oceanTreasure.isChecked();
  FunctionConfig.collectCoins = ui.collectCoins.isChecked();
  FunctionConfig.soloHunt.enabled = ui.soloHunt.isChecked();
  updateStorage();
}

ui.layout(
    <drawer id="drawer">
        <vertical>
          <appbar>
            <toolbar id="toolbar" title="口袋小助手"/>
            <tabs id="tabs"/>
          </appbar>

          <viewpager id="viewpager">
            <frame id="打野">
              <vertical>
                <linear>
                  <checkbox id="soloHunt"
                            text="单刷"
                            checked="{{FunctionConfig.soloHunt.enabled}}">
                  </checkbox>
                  <text marginLeft="5">编队</text>
                  <spinner id="soloHuntFormationNum"
                           entries="{{formationOptionsStr}}">
                  </spinner>
                  <text marginLeft="2">敌军</text>
                  <spinner id="soloHuntEnemyType"
                           entries="{{soloHuntEnemyOptionsStr}}">
                  </spinner>
                </linear>
                <linear>
                  <text marginLeft="40">方式</text>
                  <spinner id="soloHuntAttackType"
                           entries="{{soloHuntAttackTypeOptionsStr}}">
                  </spinner>
                  <text marginLeft="10" text="次数"/>
                  <input id="soloHuntTimes" inputType="number"
                         text="{{FunctionConfig.soloHunt.times}}"/>
                </linear>
                <text>====================================================</text>
                <linear>
                  <checkbox id="enableRallyHunt"
                            text="集结"
                            checked="{{FunctionConfig.rallyHunt.enabled}}">
                  </checkbox>
                </linear>
                <linear>
                  <checkbox id="rallyHunt_enableChuizi" text="锤子"
                            checked="{{FunctionConfig.rallyHunt.chuizi.enabled}}"/>
                  <text marginLeft={"10"} text="次数"/>
                  <input id="rallyHunt_chuiziTimes" inputType="number"
                         text="{{FunctionConfig.rallyHunt.chuizi.times}}"/>

                  <text marginLeft="5">编队</text>
                  <spinner id="rallyHuntChuiziFormationNum"
                           entries="{{formationOptionsStr}}">
                  </spinner>
                </linear>
                <linear>
                  <checkbox id="rallyHunt_enableJuxing" text="惧星"
                            checked="{{FunctionConfig.rallyHunt.chuizi.enabled}}"/>
                  <text marginLeft={"10"} text="次数"/>
                  <input id="rallyHunt_juxingTimes" inputType="number"
                         text="{{FunctionConfig.rallyHunt.juxing.times}}"/>
                  <text marginLeft="5">编队</text>
                  <spinner id="rallyHuntJuxingFormationNum"
                           entries="{{formationOptionsStr}}">
                  </spinner>
                </linear>
                <linear>
                  <checkbox id="rallyHunt_enableRight" text="最后一格"
                            checked="{{FunctionConfig.rallyHunt.right.enabled}}"/>
                  <text marginLeft={"10"} text="次数"/>
                  <input id="rallyHunt_rightTimes" inputType="number"
                         text="{{FunctionConfig.rallyHunt.right.times}}"/>
                  <text marginLeft="5">编队</text>
                  <spinner id="rallyHuntRightFormationNum"
                           entries="{{formationOptionsStr}}">
                  </spinner>
                </linear>

              </vertical>
            </frame>

            <frame id="跟车">
              <vertical>
                <linear>
                  <checkbox id="enableFollowCar" desc="enableFollowCar"
                            text="开启跟车"
                            checked="{{FunctionConfig.getInBus.enabled}}">
                  </checkbox>
                  <text marginLeft="40">跟车编队</text>
                  <spinner id="getInBusFormationNum"
                         entries="{{formationOptionsStr}}">
                </spinner>
              </linear>
              <linear>
                <checkbox id="enableChuizi" text="锤子"
                          checked="{{FunctionConfig.getInBus.chuizi.enabled}}"/>
                <text marginLeft={"10"} text="次数"/>
                <input id="chuiziTimes" inputType="number"
                       text="{{FunctionConfig.getInBus.chuizi.times}}"/>
              </linear>
              <linear>
                <checkbox id="enableHeiJun" text="黑暗军团"
                          checked="{{FunctionConfig.getInBus.heijun.enabled}}"/>
                <text marginLeft={"10"} text="次数"/>
                <input id="heiJunTimes" inputType="number"
                           text="{{FunctionConfig.getInBus.heijun.times}}"/>
                  </linear>
                  <linear>
                    <checkbox id="enableNanmin" text="难民"
                              checked="{{FunctionConfig.getInBus.nanmin.enabled}}"/>
                    <text marginLeft={"10"} text="次数"/>
                    <input id="nanminTimes" inputType="number"
                           text="{{FunctionConfig.getInBus.nanmin.times}}"/>
                  </linear>

                  <linear>
                    <checkbox id="enableJuxing" text="惧星"
                              checked="{{FunctionConfig.getInBus.juxing.enabled}}"/>
                    <text marginLeft={"10"} text="次数"/>
                    <input id="juxingTimes" inputType="number"
                           text="{{FunctionConfig.getInBus.juxing.times}}"/>
                  </linear>

                </vertical>
              </frame>

            {/*===================下田 宝藏===================*/}
            <frame>
              <text>第4页</text>
            </frame>

            {/*===================热门活动===================*/}
            <frame id="热门活动">
              <vertical>
                <linear>
                  <checkbox id="oceanTreasure" text="深海寻宝"
                            checked="{{FunctionConfig.events.oceanTreasure.enabled}}"></checkbox>
                  <text marginLeft="40">探测器数量</text>
                  <spinner id="detectorNum"
                           entries="{{detectorNumOptionsStr}}">
                  </spinner>
                </linear>
              </vertical>
            </frame>

            <frame>
              <text>第5页</text>
            </frame>


            {/*===================日常===================*/}
            <frame>
              <vertical>
                {/*                <linear>
                  <checkbox id="enableRoutine" text="开启日常"
                            checked="{{FunctionConfig.routine.enabled}}"></checkbox>
                  <text marginLeft="40">跟车编队</text>
                  <spinner id="getInBusFormationNum"
                           entries="{{formationOptionsStr}}">
                  </spinner>

                </linear>*/}
                <checkbox id="collectCoins" text="领取金币"
                          checked="{{FunctionConfig.collectCoins}}">
                </checkbox>

                <checkbox id="expedition" text="远程行动"
                          checked="{{FunctionConfig.expedition}}">
                </checkbox>
              </vertical>
            </frame>
          </viewpager>
        </vertical>
      <vertical layout_gravity="left" bg="#ffffff" w="280">
        <img w="280" h="200" scaleType="fitXY"
             src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg"/>
        <list id="menu">
          <horizontal bg="?selectableItemBackground" w="*">
            <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}"/>
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center"/>
                </horizontal>
            </list>
        </vertical>
    </drawer>
);
//下拉框反显数据
ui.post(function() {
  let formationOptions = formationOptionsStr.split("|");
  ui.getInBusFormationNum.setSelection(formationOptions.indexOf(FunctionConfig.getInBus.formationNum));
  let detectorNums = detectorNumOptionsStr.split("|");
  ui.detectorNum.setSelection(detectorNums.indexOf(FunctionConfig.events.oceanTreasure.detectorNum));
  let soloHuntEnemys = soloHuntEnemyOptionsStr.split("|");
  ui.soloHuntEnemyType.setSelection(soloHuntEnemys.indexOf(FunctionConfig.soloHunt.type));

  let soloHuntAttackType = soloHuntAttackTypeOptionsStr.split("|");
  ui.soloHuntAttackType.setSelection(soloHuntAttackType.indexOf(FunctionConfig.soloHunt.attackType));
});



//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu=>{
    menu.add("设置");
    menu.add("关于");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item)=>{
    switch(item.getTitle()){
        case "设置":
            toast("待实现");
            break;
        case "关于":
            alert("关于", "口袋小助手 v0.0.1 \n作者：@yang");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["打野","跟车", "下田", "活动","曙光","日常",]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

//让工具栏左上角可以打开侧拉菜单
ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([
  {
      title: "退出",
      icon: "@drawable/ic_exit_to_app_black_48dp"
  }
]);

ui.menu.on("item_click", item => {
    switch(item.title){
        case "退出":
            ui.finish();
            break;
    }
})
ui.chuiziTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.getInBus.chuizi.times = text.toString();
    updateStorage();
  }
});

ui.heiJunTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.getInBus.heijun.times = text.toString();
    updateStorage();
  }
});

ui.nanminTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.getInBus.nanmin.times = text.toString();
    updateStorage();
  }
});

ui.juxingTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.getInBus.juxing.times = text.toString();
    updateStorage();
  }
});

ui.getInBusFormationNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    FunctionConfig.getInBus.formationNum = parent.getItemAtPosition(position).toString(); // 或者根据需要更新字段
    updateStorage();
  },
})

ui.detectorNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    FunctionConfig.events.oceanTreasure.detectorNum = parent.getItemAtPosition(position).toString(); // 或者根据需要更新字段
    updateStorage();
  },
})

//===========单刷 start===================
ui.soloHunt.on("check", updateConfig);
ui.soloHuntFormationNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    FunctionConfig.soloHunt.formationNum = parent.getItemAtPosition(position).toString();
    updateStorage();
  },
})

ui.soloHuntEnemyType.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    //"黑暗陆军|黑暗海军|黑暗海军|三军轮流|最右边"
    let selected = parent.getItemAtPosition(position).toString();
    switch (selected) {
      case "黑暗陆军":
        FunctionConfig.soloHunt.type = "army";
        break;
      case "黑暗海军":
        FunctionConfig.soloHunt.type = "navy";
        break;
      case "黑暗空军":
        FunctionConfig.soloHunt.type = "airForce";
        break;
      case "三军轮流":
        FunctionConfig.soloHunt.type = "byTurn";
        break;
      case "最右边":
        FunctionConfig.soloHunt.type = "right";
        break;
   }
   updateStorage();
  },
})

ui.soloHuntAttackType.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    let selected = parent.getItemAtPosition(position).toString();
    switch (selected) {
      case "五连":
        FunctionConfig.soloHunt.attackType = "五连";
        break;
      case "单次":
        FunctionConfig.soloHunt.attackType = "单次";
        break;
    }
    updateStorage();
  },
})

ui.soloHuntTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.soloHunt.times = text.toString();
    updateStorage();
  }
});
//===========单刷 end===================

//===========集结 start===================
ui.enableRallyHunt.on("check", ()=>{
  FunctionConfig.rallyHunt.enabled = ui.enableRallyHunt.isChecked();
  updateStorage()
});
ui.rallyHunt_enableChuizi.on("check", ()=>{
  FunctionConfig.rallyHunt.chuizi.enabled = ui.rallyHunt_enableChuizi.isChecked();
  updateStorage()
});

ui.rallyHuntChuiziFormationNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    FunctionConfig.rallyHunt.chuizi.formationNum = parent.getItemAtPosition(position).toString();
    updateStorage();
  },
})

ui.rallyHunt_chuiziTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.rallyHunt.chuizi.times = text.toString();
    updateStorage();
  }
});
//==============//

ui.rallyHunt_enableJuxing.on("check", ()=>{
  FunctionConfig.rallyHunt.juxing.enabled = ui.rallyHunt_enableJuxing.isChecked();
  updateStorage()
});

ui.rallyHuntJuxingFormationNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    FunctionConfig.rallyHunt.juxing.formationNum = parent.getItemAtPosition(position).toString();
    updateStorage();
  },
})

ui.rallyHunt_juxingTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.rallyHunt.juxing.times = text.toString();
    updateStorage();
  }
});


ui.rallyHunt_enableRight.on("check", ()=>{
  FunctionConfig.rallyHunt.right.enabled = ui.rallyHunt_enableRight.isChecked();
  updateStorage()
});

ui.rallyHuntRightFormationNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    FunctionConfig.rallyHunt.right.formationNum = parent.getItemAtPosition(position).toString();
    updateStorage();
  },
})

ui.rallyHunt_rightTimes.addTextChangedListener({
  onTextChanged: function(text) {
    FunctionConfig.rallyHunt.right.times = text.toString();
    updateStorage();
  }
});

//===========集结 end===================

//==========日常start==================
ui.expedition.on("check", ()=>{
  FunctionConfig.expedition = ui.expedition.isChecked();
  updateStorage()
});
ui.collectCoins.on("check", ()=>{
  FunctionConfig.collectCoins = ui.collectCoins.isChecked();
  updateStorage()
});


// 监听表单元素变化
ui.enableFollowCar.on("check", updateConfig);
ui.enableChuizi.on("check", updateConfig);
// ui.chuiziTimes.on("change", updateConfig);
ui.enableHeiJun.on("check", updateConfig);
ui.enableNanmin.on("check", updateConfig);
ui.enableJuxing.on("check", updateConfig);
ui.oceanTreasure.on("check", updateConfig);



function addCheckListener(element) {
  element.on("check", updateConfig);
}

events.on("key", function (keyCode, event){
  if(keyCode === keys.back ) {
    //&& event.getAction() === event.ACTION_UP
    console.log("监听到返回键按下")
    ui.finish()
  }
})