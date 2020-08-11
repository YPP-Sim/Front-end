import React from "react";
import styled from "styled-components";
import plusIcon from "../../SVGs/plusIcon.svg";

const Root = styled.div`
  width: 238px;
  height: 339px;

  background: rgba(196, 196, 196, 0.1);
  border-radius: 20px;

  cursor: pointer;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.textFont};
  font-weight: 500;
  font-size: 24px;
  line-height: 35px;
  text-align: center;
  margin-top: 27px;
  margin-bottom: 87px;

  color: #f2f2f2;
`;

const Image = styled.img``;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CreateGameCard = () => {
  return (
    <Root>
      <Title>New game</Title>
      <ImageContainer>
        <Image src={plusIcon} />
      </ImageContainer>
    </Root>
  );
};

export default CreateGameCard;
