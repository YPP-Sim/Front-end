import React, { useState } from "react";
import styled, {keyframes} from "styled-components";
import DropdownIcon from "../icons/DropdownIcon";

const opacityAnim = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

const Root = styled.div`
  position: relative;
  margin-left: 40px;
  padding-bottom: 20px;
  color: ${({theme}) => theme.textColor};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.accentColor};
}
`;

const Title = styled.h4`
    font-family: ${({theme}) => theme.textFont};
    margin: 0;
    padding: 0;


    text-decoration: none;

    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    user-select: none;

    color: inherit;
    
`;

const TitleContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 10px;
`;

const LinksContainer = styled.div`
  background-color: rgba(125,125,125,0.23);

  position: absolute;
  top: 25px;
  left: -30px;

  border-radius: 5px;
  overflow: hidden;
  animation: ${opacityAnim} 0.1s linear;
`;


const LinksDropdown = ({title, children}) => {
    const [isActive, setActive] = useState(false);
  return <Root onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      <TitleContainer >
        <Title>{title}</Title>
        <DropdownIcon active={isActive}/>
      </TitleContainer>

      {
        isActive && (
        <LinksContainer>{children}</LinksContainer>
        )
      }

  </Root>;
};

export default LinksDropdown;
