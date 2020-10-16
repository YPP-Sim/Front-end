import styled from "styled-components"

const Title = styled.h2`
    font-size: 25px;
    margin: 0;
    padding: 0;
    margin-bottom: ${(props) => props.loading ? "0px" : "50px"};
    color: #333;
    font-family: ${({theme}) => theme.titleFont};
`;

export default Title;