import styled from "styled-components"

const SubmitButton = styled.button`
    outline: none;
    height: 60px;
    border: 0;
    border-radius: 4px;
    background-color: #1e1e1e;
    width: 100%;
    color: #ccc;
    font-family: ${(({theme}) => theme.textFont)} sans-serif;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 25px;
    font-size: 18px;
    box-shadow: 0 17px 40px 0 rgba(75, 128, 182, 0.07);
    transition: background-color 0.1s ease-out;

    &:hover {
        background-color: #000;
    }

`;

export default SubmitButton