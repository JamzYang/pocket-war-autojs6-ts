"ui";

var color = "#009688";
let formationOptionsStr = "1|2|3|4|5|6|7|8"
let detectorNumOptionsStr = "1|2|3"
var FunctionConfig = {
  collectCoins: false,
  gatherFood: false,
  soloHunt: {
    enabled: false,
    type: "normal", // "normal" 表示普通怪，"elite" 表示精英怪
    level: "1",
    formationNum: "1"
  },
  rallyHunt: {
    enabled: false,
    type: "normal",
    level: "0",
    formationNum: "0"
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
var storedConfig = storages.create("FunctionConfig").get("config");
// console.log("从本地存储读取配置："+storedConfig)
if (storedConfig) {
  let storedConfigParsed = JSON.parse(storedConfig);
  mergeConfig(FunctionConfig, storedConfigParsed);
  FunctionConfig = storedConfigParsed;
}

function updateStorage(){
  // console.log("更新本地存储配置："+JSON.stringify(FunctionConfig))
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
  console.log("更新配置：")
  console.log(JSON.stringify(FunctionConfig))
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
                <text>待实现</text>
              </frame>

              <frame id="跟车">
                <vertical>
                  <linear>
                    <checkbox id="enableFollowCar" desc="enableFollowCar" text="开启跟车"
                              checked="{{FunctionConfig.getInBus.enabled}}"></checkbox>
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
                          checked="{{FunctionConfig.collectCoins}}"></checkbox>
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
//反显数据
ui.post(function() {
  let formationOptions = formationOptionsStr.split("|");
  ui.getInBusFormationNum.setSelection(formationOptions.indexOf(FunctionConfig.getInBus.formationNum));
  let detectorNums = detectorNumOptionsStr.split("|");
  ui.detectorNum.setSelection(detectorNums.indexOf(FunctionConfig.events.oceanTreasure.detectorNum));
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
    // 更新 FunctionConfig 中的相应字段
    FunctionConfig.getInBus.formationNum = parent.getItemAtPosition(position).toString(); // 或者根据需要更新字段
    updateStorage();
  },
})

ui.detectorNum.setOnItemSelectedListener({
  onItemSelected: function(parent, view, position, id) {
    // 更新 FunctionConfig 中的相应字段
    FunctionConfig.events.oceanTreasure.detectorNum = parent.getItemAtPosition(position).toString(); // 或者根据需要更新字段
    updateStorage();
  },
})

// 监听表单元素变化
ui.enableFollowCar.on("check", updateConfig);
ui.enableChuizi.on("check", updateConfig);
// ui.chuiziTimes.on("change", updateConfig);
ui.enableHeiJun.on("check", updateConfig);
ui.enableNanmin.on("check", updateConfig);
ui.enableJuxing.on("check", updateConfig);
ui.oceanTreasure.on("check", updateConfig);
ui.collectCoins.on("check", updateConfig);


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