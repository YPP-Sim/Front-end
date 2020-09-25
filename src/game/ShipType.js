import wfOrientations from "../assets/vessel/wf/properties.json";
import wfSinkingOrientations from "../assets/vessel/wf/sinking.json";

import wbOrientations from "../assets/vessel/wb/properties.json";
import wbSinkingOrientations from "../assets/vessel/wb/sinking.json";

import CannonType from "./CannonType";

const shipTypes = {
  WAR_FRIG: {
    name: "War Frigate",
    textureName: "wfShip",
    sinkingTextureName: "wfSinking",
    orientations: wfOrientations,
    sinkingOrientations: wfSinkingOrientations,
    hasStallToken: true,
    cannonType: CannonType.LARGE,
  },
  WAR_BRIG: {
    name: "War Brig",
    textureName: "wbShip",
    sinkingTextureName: "wfSinking",
    orientations: wbOrientations,
    sinkingOrientations: wbSinkingOrientations,
    hasStallToken: true,
    cannonType: CannonType.MEDIUM,
  },
};

export default shipTypes;
