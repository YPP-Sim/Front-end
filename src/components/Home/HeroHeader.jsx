import React from "react";
import styled from "styled-components";
import bgImage from "../../images/ship-whee1l.jpg";
import Button from "../Button";

const Root = styled.div`
  background: radial-gradient(
      at center center,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.2) 65%,
      rgba(0, 0, 0, 0.5) 100%
    ),
    url(${bgImage});

  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  // transform: translateY(-80px);
`;

const HeroButton = styled(Button)`
  width: 90%;
  height: 56px;
  max-width: 450px;
  font-size: 21px;
  // text-transform: uppercase;
`;

const HeroHeader = () => {
  return (
    <Root>
      <CenterContainer>
        <HeroButton backgroundColor="#4663ac" color="#fff">
          Play Now
        </HeroButton>
      </CenterContainer>
    </Root>
  );
};

export default HeroHeader;
