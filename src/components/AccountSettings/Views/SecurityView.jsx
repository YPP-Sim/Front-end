import React, {useState} from "react";
import styled from "styled-components";
import ViewTitle from "../ViewTitle";
import Button from "../../ThemedButton";
import GlobalLoader from "../../loaders/GlobalLoader";
import axiosAuth from "../../../axios-config";
import SuccessMessage from "../../Forms/SuccessMessage";
import ErrMessage from "../../Forms/ErrorMessage";

const Root = styled.div`
  ${(props) => props.centered ? `
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    ` : ""};
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

const ErrorMessage = styled(ErrMessage)`
  transform: translateY(0px);
`;

const SecurityView = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);


  const handleSubmit = (e) => {
    e.preventDefault();

    if(password.length < 4) {
      setErrorMsg("Password must have a length of atleast 4 characters");
      return;
    }

    if(password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    axiosAuth.put("/user/update", {password})
    .then(() => {
      setUpdated(true);
    })
    .catch(() => {
      setUpdated(false);
      setErrorMsg("Could not update password, server error");
    })
    .finally(() => {
      setLoading(false);
    });
  }

  if(loading) return <Root centered><GlobalLoader /></Root>

  return <Root>
      <ViewTitle>Security</ViewTitle>
      <div>
        <form onSubmit={handleSubmit}>
          <FieldContainer>
            <FieldLabel>Change Password</FieldLabel>
            <Field type="password" placeholder="Password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Confirm Password</FieldLabel>
            <Field type="password" placeholder="Confirm Password" name="confirmpassword" id="confirmpassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </FieldContainer>
          {updated && (
            <SuccessMessage>Password successfully updated</SuccessMessage>
          )}
          {
            errorMsg && (
            <ErrorMessage>{errorMsg}</ErrorMessage>
            )
          }
          <Button>Confirm Changes</Button>
        </form>
      </div>
  </Root>;
};

export default SecurityView;
