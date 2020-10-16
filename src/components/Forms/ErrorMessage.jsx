import styled from "styled-components";

const ErrorMessage = styled.p`
    text-align: left;
    width: 100%;
    color: red;
    font-size: 16px;
    font-family: ${({theme}) => theme.textFont};
    margin: 0;
    padding: 0;
    margin-left: 10px;

    transform: translateY(-20px);
`;

export default ErrorMessage;