import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Button from "../Button";
import gameImg from "../../images/Game.png";

const Root = styled.div`
  margin: 100px ${({ theme }) => theme.pageMargins};

  @media (max-width: 1024px) {
    margin: 100px ${({ theme }) => theme.pageMarginsTablet};
  }
`;

const CenterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TitleStatement = styled.h2`
  font-family: ${({ theme }) => theme.textFont};
  font-size: 36px;
  font-style: normal;
  font-weight: bold;
  margin: 0;
  line-height: 53px;

  max-width: 440px;
  color: ${({ theme }) => theme.textColor};
`;

const TitleDescription = styled.p`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 35px;

  margin: 0;
  margin-top: 20px;
  margin-bottom: 40px;
  max-width: 600px;

  color: ${({ theme }) => theme.textColor};
`;

const MaxWidthContainer = styled.div`
  max-width: ${({ theme }) => theme.pageMaxWidth};
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0 auto;
`;

const CTAContainer = styled.div`
  width: 100%;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 314px;
  background-image: url(${gameImg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  filter: drop-shadow(0px 10px 50px rgba(0, 0, 0, 0.25));
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
            <TitleStatement>
              A better, free, Puzzle Pirates blockade simulator
            </TitleStatement>
            <TitleDescription>
              Web-based and aims to give a better user experience. All without
              the need to download a client.
            </TitleDescription>
            <Button onClick={handlePlayClick} width="203px" height="55px">
              Play
            </Button>
          </CTAContainer>
          <ImageContainer></ImageContainer>
        </CenterContainer>
      </MaxWidthContainer>
    </Root>
  );
};

export default HeroHeader;
