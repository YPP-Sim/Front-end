import React from "react";
import styled from "styled-components";

const Root = styled.div`
display: block;
width: 100%;
height: 60px;
border: 0;
margin-bottom: 30px;
background-color: #eee;
border-radius: 4px;
position: relative;
font-size: 17px;
transition: opacity 0.2s ease-in-out, filter 0.2s ease-in-out,
  box-shadow 0.1s ease-in-out;


  & input:focus + label,
  & input:not(:placeholder-shown) + label {
    bottom: 30px;
    font-size: 13px;
    opacity: 0.7;
  }

`;

const InputField = styled.input`
position: absolute;
  border: 0;
  box-shadow: none;
  background-color: rgba(255, 255, 255, 0);
  top: 0;
  height: 60px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 3;
  display: block;
  color: #333;
  font-size: 17px;
  font-family: ${({theme}) => theme.textFont}, sans-serif;
  transition: top 0.1s ease-in-out;

  outline: none;

  &::placeholder {
    color: rgba(0, 0, 0, 0);
  }

  &:focus,
  &:not(:placeholder-shown) {
      top: 7px;
  }
 
`;

const Label = styled.label`
    position: absolute;

    border: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: #555;
    opacity: 0.9;
    box-sizing: border-box;
    transition: all 0.1s ease-in-out;
    cursor: text;
`;

const LoginField = ({type, name, id, value, label, onChange}) => {
  return <Root> 
      <InputField type={type} name={name} id={id} placeholder={label} required="required" value={value} onChange={onChange}/>
        <Label>{label}</Label>
  </Root>;
};

export default LoginField;
