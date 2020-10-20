import React, {useEffect, useState} from "react";
import styled from "styled-components";
import ViewTitle from "../ViewTitle";
import axiosAuth from "../../../axios-config";
import GlobalLoader from "../../loaders/GlobalLoader";
import Button from "../../ThemedButton";
import ErrMessage from "../../Forms/ErrorMessage";
import SuccessMessage from "../../Forms/SuccessMessage";

const Root = styled.div`
    width: 100%;
    height: 100%;
`;

const DetailsContainer = styled.div`
  `;

  const FieldContainer = styled.div`
    display: flex;
    margin-bottom: 10px;
    padding: 10px 15px;
    background-color: rgba(125,125,125,0.1);
    border-radius: 4px;
    box-sizing: border-box;

    justify-content: space-between;
  `;

const FieldValue = styled.p`
  font-family: ${({theme}) => theme.textFont};
  color: ${({theme}) => theme.textColor};
  font-size: 17px;
  margin: 0;
  padding: 0;
  margin-left: 15px;
`;

const FieldKey = styled(FieldValue)`
  font-weight: 500;
  margin: 0;
  color: #999;
`;

const Field = styled.input`
  border: 0;
  outline: none;
  padding: 0px 10px;
  height: 30px;
  background-color: #aaa;
  border-radius: 4px;
  color: #232323df;
  font-family: ${({theme}) => theme.textFont};
`;

const FieldLabel = styled.label`
font-weight: 500;
margin: 0;
color: #999;
`;

const getDetails = (setLoading, setDetails) => {
  setLoading(true);
    axiosAuth.get("/user/details").then((response) => {
      setDetails(response.data);
    }).catch((err) => {
      console.log(err.response);
    }).finally(() => {
      setLoading(false);
    });
}

const ErrorMessage = styled(ErrMessage)`
  transform: translateY(0px);
`;

const AccountDetailsView = () => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [updated, setUpdated] = useState(false);
  const [emailError, setEmailError] = useState(null);

  useEffect(() => {
    getDetails(setLoading, setDetails);
  }, []);

  const onSubmitChanges = (e) => {
    e.preventDefault();
    if(emailInput.length <= 0) {
      setEmailError("Email field is empty");
      return;
    }

    setLoading(true);
    setEmailError(null);
    axiosAuth.put("/user/update", {email: emailInput})
    .then(() => {
      setUpdated(true);
    })
    .catch(err => {
      console.log("error updating email: ", err.response);
      if(err.response && err.response.data.error) {
        setEmailError(err.response.data.error);
      }
      setUpdated(false);
    })
    .finally(() => {
      getDetails(setLoading, setDetails);
    });

  }

  return <Root>
      <ViewTitle>Account Details</ViewTitle>
      {loading ? (
        <GlobalLoader />
      ) : details && (
          <DetailsContainer>
            <FieldContainer>
              <FieldKey>Username:</FieldKey>
              <FieldValue>{details.username}</FieldValue>
            </FieldContainer>

            <FieldContainer>
              <FieldKey>Email:</FieldKey>
              <FieldValue>{details.email}</FieldValue>
            </FieldContainer>

            <FieldContainer>
              <FieldKey>Date joined:</FieldKey>
              <FieldValue>{details.createdAt}</FieldValue>
            </FieldContainer>

            <form onSubmit={onSubmitChanges}>
              <FieldContainer>
                <FieldLabel>Update Email:</FieldLabel>
                <Field type="email" placeholder="Email" name="email" id="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
              </FieldContainer>
              {emailError && (
                <ErrorMessage>{emailError}</ErrorMessage>
              )}
              {
                updated && (
                  <SuccessMessage>Email successfully updated</SuccessMessage>
                )
              }
              <Button>Submit Changes</Button>
            </form>
          </DetailsContainer>
        )
      }
  </Root>;
};

export default AccountDetailsView;
