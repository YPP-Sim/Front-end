import React from "react";
import styled from "styled-components";
import bgImage from "../../images/filler2.jpg";
import NavBar from "../NavBar";
import Button from "../Button";

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
  font-weight: 400;
  margin: 0;
`;

const TitleDescription = styled.p`
  font-size: 19px;
  margin: 0;
  margin-top: 20px;
  margin-left: 2px;
  margin-bottom: 20px;
  text-shadow: 1px 2px #00000066;

  font-family: ${({ theme }) => theme.textFont};
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;

const SecondaryButton = styled(Button)`
  color: white;
  background-color: #00000000;
  border: 1px solid white;
  margin: 10px 15px 10px 15px;

  &:hover {
    background-color: white;
    color: black;
  }
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
  border-radius: 5px;
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
              A better, free, Puzzle Pirates blockade simulator that is
              web-based and aims to give a better user experience. All without
              the need to download a client.
            </TitleDescription>

            <ButtonsContainer>
              <Button margin="10px 15px 10px 0px">Play</Button>
              <SecondaryButton>Learn more</SecondaryButton>
            </ButtonsContainer>
          </CTAContainer>
        </CenterContainer>
      </MaxWidthContainer>
    </Root>
  );
};

export default HeroHeader;
