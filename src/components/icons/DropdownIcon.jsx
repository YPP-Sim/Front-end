import React from "react";
import styled from "styled-components";

const RootSVG = styled.svg`
    width: 13px;
    height: 13px;
    margin-left: 13px;
`;

const DropdownIcon = ({active}) => {
  return <RootSVG version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
  width="284.929px" height="284.929px" viewBox="0 0 284.929 284.929"
    >
    <g>
    <path fill={active ? "#2DB1BE" : "#fff"} d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
        L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
        c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
        c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
    </g>

    </RootSVG>;
};

export default DropdownIcon;
