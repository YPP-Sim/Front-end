import React from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 28px;
  margin: 10px;
  max-width: 1200px;
  background-color: rgba(196, 196, 196, 0.07);
  border-radius: 20px;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
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
  opacity: 0.7;
`;

const ChangesTitle = styled.p`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  padding-bottom: 5px;
  text-align: center;

  color: ${({ theme }) => theme.textColor};

  border-bottom: 1px solid white;
  margin-bottom: 20px;
`;

const Content = styled.div`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
  text-align: justify;

  color: ${({ theme }) => theme.textColor};

  margin-bottom: 14px;
`;

const ChangeList = styled.ul``;

const ChangeListItem = styled.li`
  font-family: ${({ theme }) => theme.textFont};
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 26px;
  text-align: justify;

  color: ${({ theme }) => theme.textColor};

  //   margin-bottom: 14px;
`;

const PatchNotes = ({ data }) => {
  const { title, date, description, changeList } = data;
  return (
    <Root>
      <Title>{title}</Title>
      <Date>{date}</Date>
      <Content>{description}</Content>
      <ChangesTitle>Changes</ChangesTitle>
      <ChangeList>
        {changeList.map((change, index) => (
          <ChangeListItem key={index}>{change}</ChangeListItem>
        ))}
      </ChangeList>
    </Root>
  );
};

export default PatchNotes;
