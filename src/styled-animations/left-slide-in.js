import { keyframes } from "styled-components";

const leftSlideIn = keyframes`
    from {
        opacity: 0;
        transform: translateX(-200px);
    }

    to {
        opacity: 1;
        transform: translateX(0px);
    }
`;

export default leftSlideIn;
