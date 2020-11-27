import styled from "styled-components";

const ProgressBunnyWrapper = styled.div`
  display: flex;
  z-index: 2;
  top: 0;
  position: absolute;
  transform: translateX(-50%) translateY(-100%);
  transition: left 200ms ease-out;
`;

export default ProgressBunnyWrapper;
