import React, { useEffect, useState } from "react";
import axiosAuth from "../../axios-config";
import moment from "moment";
import styled from "styled-components";
import GlobalLoader from "../loaders/GlobalLoader";
import MapView from "./MapView";

const Root = styled.div`
    width: 100%;
    min-width: 500px;
    max-width: 500px;
    background-color: rgb(49,56,64);
`;

const Title = styled.h2`
  font-family: ${({theme}) => theme.textFont};
  color: ${({theme}) => theme.textColor};
  font-size: 26px;
  margin: 0;
  padding: 0;
  text-align: center;
  margin-top: 25px;
  margin-bottom: 15px;
  `;

const SecondaryText = styled.p`
  font-family: ${({theme}) => theme.textFont};
  color: #999999;
  padding: 0;
  margin: 0;
  text-align: center;
`;

const MapDetails = ({ mapId }) => {
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(mapId === null) return;

    setLoading(true);
    axiosAuth.get(`/maps/dbmaps/${mapId}`)
    .then((res) => {
      setMap(res.data);
    })
    .catch(err => {
      console.log("Err: ", err.response);
    })
    .finally(() => {
      setLoading(false);
    })
  }, [mapId]);

  if(loading) {
    return <Root>
      <GlobalLoader />
    </Root>
  }

  if(!map) return <Root></Root>;
  return <Root>
    <Title>{map.title}</Title>
      <SecondaryText>Created by: {map.createdBy && map.createdBy.username}</SecondaryText>
      <SecondaryText>Date created: {moment(map.createdAt).format("L")}</SecondaryText>
      {map && map.layout && (
        <MapView map={map.layout}/>
      )}
  </Root>;
};

export default MapDetails;
