import React, {useState, useEffect} from "react";
import styled from "styled-components";
import MapDetails from "./MapDetails";
import axiosAuth from "../../axios-config";
import MapList from "./MapList";
import ThemedButton from "../ThemedButton";

const Root = styled.div`
  z-index: 40;
`;

const MapContainer = styled.div`
  display: flex;
  min-height: 550px;
  min-width: 400px;
  width: 100%;
  height: 100%;
  max-height: 750px;
  justify-content: center;

`;

const Buttons = styled.div`
    display: flex;
`;

const CancelButton = styled(ThemedButton)`
    background-color: #e64539;
    margin-left: 10px;
    color: white;
    &:hover {
        background-color: #b7372d;
    }
    
`;

const Maps = ({ onSelect, onClose }) => {
  const [maps, setMaps] = useState([]);
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
      axiosAuth.get("/maps/dbmaps").then((res) => {
        setMaps(res.data);
        setSelectedMap(res.data[0]);
      })
      .catch(err => {
        console.log("Error: ", err.response);
      }) 
  }, []);

  return <Root>
       <MapContainer>
            <MapList list={maps} onSelectMap={setSelectedMap}/>
            <MapDetails mapId={selectedMap ? selectedMap._id : null} />
        </MapContainer>

        {onSelect && (
            <Buttons>
                <ThemedButton onClick={() => onSelect(selectedMap.title)}>Choose: {selectedMap ? selectedMap.title : "Map"}</ThemedButton>
                <CancelButton onClick={onClose}>Cancel</CancelButton>
            </Buttons>
        )}
    </Root>;
};

export default Maps;
