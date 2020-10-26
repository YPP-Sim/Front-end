import { keyframes } from "styled-components";

const popup = keyframes`
    from {
        transform: translateY(40px);
        opacity: 0;
    }

    to {
        transform: transateY(0px);
        opacity: 1;
    }
`;

export default popup;
