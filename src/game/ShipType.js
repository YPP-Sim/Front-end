import wfOrientations from "../assets/vessel/wf/properties.json";
import wfSinkingOrientations from "../assets/vessel/wf/sinking.json";
import CannonType from "./CannonType";

const shipTypes = {
  warFrig: {
    name: "War Frigate",
    textureName: "wfShip",
    sinkingTextureName: "wfSinking",
    orientations: wfOrientations,
    sinkingOrientations: wfSinkingOrientations,
    hasStallToken: true,
    cannonType: CannonType.LARGE,
  },
};

export default shipTypes;
