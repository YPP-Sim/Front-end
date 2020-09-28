import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import arrowImg from "../../SVGs/arrow.svg";

const Root = styled.div``;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 600;
  font-size: 19px;
  line-height: 26px;

  margin: 0;
  padding: 0;
  color: ${({ theme }) => theme.textColor};
  letter-spacing: 1px;
`;

const Date = styled(Title)`
  font-weight: normal;
  letter-spacing: 0;
  font-size: 18px;
  margin: 8px 0px;
`;

const StyledLink = styled(Link)`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;

  color: #29b3bc;

  text-decoration: none;

  margin: 0;
  padding: 0;
`;

const Content = styled.div`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;

  color: ${({ theme }) => theme.textColor};

  margin-bottom: 14px;
`;

const ArrowIcon = styled.img`
  margin-left: 16px;
`;

const PatchNotes = ({ title, children, linkTo, date }) => {
  return (
    <Root>
      <Title>{title}</Title>
      <Date>{date}</Date>
      <Content>{children}</Content>
      {linkTo && (
        <StyledLink to={linkTo}>
          Read more
          <ArrowIcon src={arrowImg} />
        </StyledLink>
      )}
    </Root>
  );
};

export default PatchNotes;
