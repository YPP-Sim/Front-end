import React from "react";
import styled from "styled-components";
import HeroHeader from "./HeroHeader";
import HomeContent from "./HomeContent";
import HomeWave from "./HomeWave";
import News from "./News";
import flagImage from "../../images/buoy.png";
import tokenImage from "../../images/gold_token.png";
import shipImage from "../../images/wb.png";

const Root = styled.div``;

const ContentSection = styled.div`
  padding-bottom: ${(props) => props.pb};
  padding-top: ${(props) => props.pt};
`;

const ContentTitle = styled.h2`
  margin: 0;
  padding: 0;

  margin-bottom: ${(props) => props.mb};

  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 500;
  font-size: 36px;
  line-height: 53px;

  text-align: center;

  color: ${({ theme }) => theme.textColor};
`;

const FeatureBoxes = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    margin-right: 100px;
  }

  div:last-child {
    margin-right: 0px;
  }

  @media (max-width: ${({ theme }) => theme.size.tablet}) {
    flex-direction: column;

    div {
      margin-right: 0px;
      margin-bottom: 50px;
    }
  }
`;

const FeatureBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  max-width: ${(props) => props.mw};
`;

const FeatureImage = styled.img`  
  width: ${(props) => props.width}
  height: ${(props) => props.height};

  margin-bottom: 8px;
`;

const FeatureText = styled.p`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  text-align: center;

  color: ${({ theme }) => theme.textColor};
`;

const MaxWidthContainer = styled.div`
  max-width: ${({ theme }) => theme.pageMaxWidth};
  margin: 0 auto;
`;

const HomePage = () => {
  return (
    <Root>
      <HeroHeader />
      <HomeWave />
      <HomeContent>
        <MaxWidthContainer>
          <ContentSection pt="95px">
            <ContentTitle mb="68px">Features</ContentTitle>

            <FeatureBoxes>
              <FeatureBox mw="282px">
                <FeatureImage height="80px" src={shipImage} />
                <FeatureText>
                  Take your pick at multiple different types of ships and prove
                  your worth. Sink a War Frig with a sloop!
                </FeatureText>
              </FeatureBox>
              <FeatureBox mw="339px">
                <FeatureImage height="80px" src={flagImage} />
                <FeatureText>
                  The original blockade game mechanics incorporated right in,
                  get more points than the opposing team before time runs out
                  and win the game.
                </FeatureText>
              </FeatureBox>

              <FeatureBox mw="282px">
                <FeatureImage height="80px" src={tokenImage} />
                <FeatureText>
                  Make it more interesting with special maneuvers. Outplay your
                  opponents with a double forward, and more.
                </FeatureText>
              </FeatureBox>
            </FeatureBoxes>
          </ContentSection>

          <ContentSection pt="157px">
            <ContentTitle mb="38px">Latest News</ContentTitle>

            <News title="Patch Notes" date="8/5/20" linkTo="/games">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh sed
              tristique eu consectetur malesuada non et aliquam congue. Lectus
              ultrices mauris vitae porttitor magna orci. A facilisis quis metus
              nisi in. Elit, vel proin et porttitor commodo. Blandit ornare
              congue et luctus. Imperdiet tempor dui dui nunc, felis imperdiet.
              Tincidunt tempor lacus nam aliquam etiam sed elit ut pulvinar.
              Eget dui sed integer aenean donec enim pulvinar tincidunt
              elementum. Morbi tellus facilisis purus gravida nibh id adipiscing
              tortor. Mauris erat vel nunc urna. Amet, libero est elementum,
              praesent ac. Neque, vitae hendrerit diam vitae morbi facilisi
              ipsum commodo. Eleifend placerat ultrices eget scelerisque
              imperdiet leo nec in mi. Risus fringilla ultricies ut semper.
              Felis, amet fermentum commodo, faucibus. Maecenas sem magna duis
              tempor ornare interdum. Amet, proin pharetra urna, ut.
            </News>
          </ContentSection>
        </MaxWidthContainer>
      </HomeContent>
    </Root>
  );
};

export default HomePage;
