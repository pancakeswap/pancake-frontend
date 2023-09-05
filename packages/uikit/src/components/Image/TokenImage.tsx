import { styled } from "styled-components";
import Image from "./Image";

const TokenImage = styled(Image)`
  > img {
    border-radius: 50%;
  }
  &:before {
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.25);
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 7;
  }
`;

export default TokenImage;
