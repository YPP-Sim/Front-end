import React from "react";
import styled from "styled-components";
import ErrorMessage from "./ErrorMessage";

const Root = styled(ErrorMessage)`
    color: #24e524;
    transform: translateY(0px);
`;

const SuccessMessage = (props) => {
return <Root>{props.children}</Root>;
};

export default SuccessMessage;
