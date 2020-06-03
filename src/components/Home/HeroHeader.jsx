import React from "react";
import styled from "styled-components";
import bgImage from "../../images/filler2.jpg";
import Button from "../Button";
import NavBar from "../NavBar";

const Root = styled.div`
  background: radial-gradient(
      at center center,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.5) 65%,
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
  // align-items: center;
  margin: ${({ theme }) => theme.pageMargins};
  justify-content: center;
  // width: 100%;
  height: 100%;
  // transform: translateY(-80px);
  color: white;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.titleFont};
  text-transform: uppercase;
  font-size: 70px;
  margin: 0;
`;

const TitleDescription = styled.p`
  font-size: 20px;
  margin: 0;
  margin-top: 20px;
  margin-left: 2px;

  font-family: ${({ theme }) => theme.textFont};
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const HeroHeader = () => {
  return (
    <Root>
      <NavBar />
      <CenterContainer>
        <Title>YPP-Sim</Title>
        <TitleDescription>A Puzzle Pirates blockade simulator</TitleDescription>

        <ButtonsContainer></ButtonsContainer>
      </CenterContainer>
    </Root>
  );
};

export default HeroHeader;
