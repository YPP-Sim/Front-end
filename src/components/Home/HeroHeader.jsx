import React from "react";
import styled from "styled-components";
import bgImage from "../../images/filler2.jpg";
import NavBar from "../NavBar";
import Button from "../Button";
import Values from "values.js";

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
  min-height: 550px;
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.pageMargins};
  justify-content: center;
  height: 80%;
  color: white;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.titleFont};
  text-transform: uppercase;
  font-size: 70px;
  margin: 0;
`;

const TitleDescription = styled.p`
  font-size: 19px;
  margin: 0;
  margin-top: 20px;
  margin-left: 2px;
  margin-bottom: 20px;

  font-family: ${({ theme }) => theme.textFont};
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.accentColor};
  &:hover {
    background-color: ${(props) => {
      const val = new Values(props.theme.accentColor).shade(23);
      return `#${val.hex}`;
    }};
  }
  color: white;

  margin: 10px 15px 10px 0px;

  font-size: 18.5px;
  font-family: ${({ theme }) => theme.textFont};
`;

const SecondaryButton = styled.a`
  color: white;
  border: 1px solid white;
  border-radius: 2px;
  text-decoration: none;
  width: 100%;
  height: 40px;
  margin: 10px 15px 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18.5px;
  &:hover {
    background-color: white;
    color: black;
  }
  font-family: ${({ theme }) => theme.textFont};
`;

const MaxWidthContainer = styled.div`
  max-width: ${({ theme }) => theme.pageMaxWidth};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin: 0 auto;
`;

const CTAContainer = styled.div`
  margin-left: 80px;
  max-width: 450px;
`;

const HeroHeader = () => {
  return (
    <Root>
      <MaxWidthContainer>
        <NavBar />
        <CenterContainer>
          <CTAContainer>
            <Title>YPP-Sim</Title>
            <TitleDescription>
              A better, free, Puzzle Pirates blockade simulator that aims to
              give a better user experience without a need to download any sort
              of client.
            </TitleDescription>

            <ButtonsContainer>
              <PrimaryButton>Play</PrimaryButton>
              <SecondaryButton href="">Learn more</SecondaryButton>
            </ButtonsContainer>
          </CTAContainer>
        </CenterContainer>
      </MaxWidthContainer>
    </Root>
  );
};

export default HeroHeader;
