import styled from "styled-components";
import { Box } from "../Box";

const Loading = styled(Box)`
  border: 2px solid transparent;
  border-radius: 50%;
  border-top: 2px solid #ddd;
  border-right: 2px solid #ddd;
  border-bottom: 2px solid transparent;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

Loading.defaultProps = {
  width: "20px",
  height: "20px",
};

export default Loading;
