import React from "react";
import styled from "styled-components";

const Root = styled.div`
    width: 100%;
    max-width: 300px;
    min-width: 200px;
    background-color: #222a32;
`;

const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
`;

const ListItem = styled.li`
    display: flex;
    align-items: center;
    width: 100%;
    height: 70px;
    box-sizing: border-box;
    padding: 0px 15px;
    color: #eee;
    font-family: ${({theme}) => theme.textFont};
    font-size: 17px;
    cursor: pointer;

    &:hover {
        background-color: ${({theme}) => theme.accentColor};
    }

`;

const MapList = ({list, onSelectMap}) => {
  return <Root>
    <List>

      {list && list.map((map, index) => (
        <ListItem onClick={() => onSelectMap(map)} key={index}>{map.title}</ListItem>
        ))}
        
    </List>

  </Root>;
};

export default MapList;
