import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import NavBar from "../HeroNavBar";
import Button from "../Button";

const Root = styled.div`
  background: linear-gradient(to bottom, #ffe259, #ffa751);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 80vh;
  min-height: 550px;
  clip-path: ellipse(100% 55% at 48% 44%);
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.pageMargins};
  justify-content: center;
  align-items: center;
  height: 80%;
  color: #252525;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.titleFont};
  text-transform: uppercase;
  font-size: 70px;
  font-weight: bold;
  text-align: center;
  margin: 0;
`;

const TitleDescription = styled.p`
  font-size: 18.5px;
  margin: 0;
  margin-top: 20px;
  text-align: justify;
  margin-bottom: 35px;
  line-height: 1.6;

  font-family: ${({ theme }) => theme.textFont};
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
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
  max-width: 450px;
  border-radius: 5px;
`;

const HeroHeader = () => {
  const history = useHistory();

  const handlePlayClick = () => {
    history.push("/games");
  };

  return (
    <Root>
      <MaxWidthContainer>
        <CenterContainer>
          <CTAContainer>
            <Title>YPP-Sim</Title>
            <TitleDescription>
              A better, free, Puzzle Pirates blockade simulator that is
              web-based and aims to give a better user experience. All without
              the need to download a client.
            </TitleDescription>

            <ButtonsContainer>
              <Button
                height="60px"
                // margin="10px 15px 10px 0px"
                onClick={handlePlayClick}
                backgroundColor="#252525"
              >
                Play
              </Button>
            </ButtonsContainer>
          </CTAContainer>
        </CenterContainer>
      </MaxWidthContainer>
    </Root>
  );
};

export default HeroHeader;
