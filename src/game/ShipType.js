import wfOrientations from "../assets/vessel/wf/properties.json";
import CannonType from "./CannonType";

const shipTypes = {
  warFrig: {
    name: "War Frigate",
    textureName: "wfShip",
    orientations: wfOrientations,
    hasStallToken: true,
    cannonType: CannonType.LARGE,
  },
};

export default shipTypes;
