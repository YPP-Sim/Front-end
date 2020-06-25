import React from "react";
import styled, { withTheme } from "styled-components";
import HeroHeader from "./HeroHeader";
import SectionTitle from "./SectionTitle";
import SectionDescription from "./SectionDescription";
import Section from "./Section";

const Root = styled.div``;

const HomePage = ({ theme }) => {
  console.log("Theme: ", theme);
  return (
    <Root>
      <HeroHeader />
      <Section>
        <SectionTitle>Features</SectionTitle>
        <SectionDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
          possimus fugit veniam nisi harum eligendi, quo omnis incidunt, labore
          iusto officiis voluptatem illo! Nesciunt repudiandae ipsam excepturi
          rerum possimus neque!
          <br />
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem harum
          exercitationem vero voluptatum similique voluptatem aperiam incidunt
          deserunt, adipisci labore totam doloribus velit ad placeat, rerum sint
          nisi. Quis, ullam.
        </SectionDescription>
      </Section>
      <Section dark backgroundColor={theme.color3}>
        <SectionTitle>Latest News</SectionTitle>
        <SectionDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
          possimus fugit veniam nisi harum eligendi, quo omnis incidunt, labore
          iusto officiis voluptatem illo! Nesciunt repudiandae ipsam excepturi
          rerum possimus neque! Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Molestiae velit nemo minima expedita rem dolores quo
          facilis earum soluta nihil? Dolore, optio repellat? Totam doloremque
          voluptatem minima suscipit iste velit!
        </SectionDescription>
      </Section>
    </Root>
  );
};

export default withTheme(HomePage);
