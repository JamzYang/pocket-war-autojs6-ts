import {dianaIsBack} from "./helper";
import {captureScreen, findImage, fromBase64, myClick, mySwipe} from "./autoHandler";
import {pointConfig} from "./config/pointConfig";
import {iconConfig} from "./config/iconConfig";
import {ToWorld} from "./steps";
import {characterState, functionConfig} from "./config/config";

export function startJushouzhinuCampaign() {
  toast("准备进行=> 巨兽之怒任务")
    // new ToWorld().execute(characterState, functionConfig);
    sleep(2000)
    if(dianaIsBack()) {
      toast("戴安娜回来了！")
      myClick(pointConfig.commonCampaignBtn.x, pointConfig.commonCampaignBtn.y, 600);
      mySwipe(450, 125, 15, 125, 2000)
      let result =findImage(captureScreen(), fromBase64(iconConfig.angerOfBeastIcon.base64),
          {threshold:0.8, region:[0, 70, 720, 120]})
      if(result != null) {
        myClick(result.x + iconConfig.angerOfBeastIcon.offSet.x,
            result.y + iconConfig.angerOfBeastIcon.offSet.y, 600);
        myClick(pointConfig.angerOfBeastResistBtn.x, pointConfig.angerOfBeastResistBtn.y);
        myClick(360, 850);
        myClick(pointConfig.formationNum1.x, pointConfig.formationNum1.y)
        myClick(pointConfig.confirmBattleBtn.x, pointConfig.confirmBattleBtn.y)
      }
      new ToWorld().execute(characterState, functionConfig)
    }else {
      toast("戴安娜出征中...")
    }
}